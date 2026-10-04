import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Lock, User as UserIcon, Mail, Phone, MapPin, 
  Key, ShieldCheck, CheckCircle2, AlertTriangle, 
  ArrowRight, Sparkles, Eye, EyeOff, ShieldAlert, Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchAdminStatus, sendAdminOTP, verifyAndRegisterAdmin 
} from '../services/api';
import { AdminStatusResponse } from '../types/scheme';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ 
  isOpen, 
  onClose,
  defaultTab = 'login' 
}) => {
  const navigate = useNavigate();
  const { login, loginWithUserCredentials } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [adminStatus, setAdminStatus] = useState<AdminStatusResponse | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Form State
  const [loginIdent, setLoginIdent] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Registration Form State
  const [regStep, setRegStep] = useState<1 | 2>(1);
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regOtp, setRegOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState<string | null>(null);
  
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAdminStatus();
      setActiveTab(defaultTab);
      setLoginError(null);
      setRegError(null);
    }
  }, [isOpen, defaultTab]);

  const loadAdminStatus = async () => {
    setLoadingStatus(true);
    try {
      const data = await fetchAdminStatus();
      setAdminStatus(data);
    } catch (err) {
      console.error('Failed to load admin status', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  if (!isOpen) return null;

  // Handle Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdent.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both username/email and password.');
      return;
    }
    setLoginSubmitting(true);
    setLoginError(null);
    try {
      const res = await loginWithUserCredentials(loginIdent.trim(), loginPassword);
      if (res.success) {
        onClose();
        navigate('/admin');
      } else {
        setLoginError(res.message || 'Invalid username/email or password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoginSubmitting(false);
    }
  };

  // Pre-fill demo admin credentials
  const fillDemoAdmin = () => {
    setLoginIdent('admin@schemes.gov.in');
    setLoginPassword('Admin@2026');
    setLoginError(null);
  };

  // Step 1: Send OTP for Registration
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regUsername.trim() || !regName.trim() || !regEmail.trim() || !regPhone.trim() || !regLocation.trim() || !regPassword) {
      setRegError('All fields are required.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters long.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }

    setRegSubmitting(true);
    try {
      const res = await sendAdminOTP({
        username: regUsername.trim().toLowerCase(),
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone_number: regPhone.trim(),
        location: regLocation.trim()
      });
      setOtpPreview(res.otp_preview || null);
      setRegSuccessMsg(res.message || `Verification OTP code dispatched to ${regEmail}.`);
      setRegStep(2);
    } catch (err: any) {
      setRegError(err.message || 'Failed to dispatch verification code.');
    } finally {
      setRegSubmitting(false);
    }
  };

  // Step 2: Verify OTP & Register Admin
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regOtp.trim()) {
      setRegError('Please enter the 6-digit verification code (OTP).');
      return;
    }

    setRegSubmitting(true);
    try {
      const res = await verifyAndRegisterAdmin({
        username: regUsername.trim().toLowerCase(),
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        phone_number: regPhone.trim(),
        location: regLocation.trim(),
        password: regPassword,
        otp: regOtp.trim()
      });

      login(res.access_token, res.user);
      onClose();
      navigate('/admin');
    } catch (err: any) {
      setRegError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setRegSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-150 my-6">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b2545] to-[#134074] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
                Official Access
              </span>
              <span className="text-xs text-blue-200 font-semibold">
                Government Nodal Portal
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Administrator & Nodal Officer Portal
            </h3>
            <p className="text-[11px] text-slate-300">
              Authorized personnel only: Manage verified schemes, audits, and partner tie-ups.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => { setActiveTab('login'); setLoginError(null); }}
            className={`flex-1 py-3 text-center transition border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-blue-900 text-[#0b2545] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Admin Login (உள்நுழைவு)
          </button>
          <button
            onClick={() => { setActiveTab('register'); setRegError(null); loadAdminStatus(); }}
            className={`flex-1 py-3 text-center transition border-b-2 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Register Admin (புதிய பதிவு)</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-extrabold">
              1 Admin Limit
            </span>
          </button>
        </div>

        {/* Tab 1: LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4 text-xs">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Username or Official Email Address
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={loginIdent}
                  onChange={(e) => setLoginIdent(e.target.value)}
                  placeholder="e.g. admin_nodal or officer@schemes.gov.in"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-900 font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full bg-[#0b2545] hover:bg-[#134074] disabled:bg-slate-400 text-white font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              {loginSubmitting ? (
                <span>Authenticating Credentials...</span>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Login to Admin Portal (உள்நுழைக)</span>
                </>
              )}
            </button>

            {/* Quick Demo Helper Badge */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Default Demo Credentials:</span>
                <span className="font-mono font-bold text-slate-800">admin@schemes.gov.in / Admin@2026</span>
              </div>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-blue-700 hover:text-blue-900 font-bold underline shrink-0 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: REGISTRATION FORM */}
        {activeTab === 'register' && (
          <div className="p-6 text-xs">
            {/* Case A: Only 1 Admin Allowed & Admin Already Exists */}
            {adminStatus && !adminStatus.can_register ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300">
                  <ShieldAlert className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Single Administrator Policy Active (ஒரு நிர்வாகி மட்டுமே)
                  </h4>
                  <p className="text-slate-600 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                    By government platform governance protocol, only <strong>ONE official administrator</strong> can be registered in this platform.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-left max-w-sm mx-auto space-y-1">
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Currently Registered Administrator</div>
                  <div className="font-bold text-[#0b2545]">{adminStatus.registered_admin_name}</div>
                  <div className="text-slate-600 font-mono text-[11px] truncate">
                    {adminStatus.registered_admin_email}
                  </div>
                  {adminStatus.registered_admin_username && (
                    <div className="text-emerald-700 font-semibold text-[11px]">
                      Username: @{adminStatus.registered_admin_username}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => { setActiveTab('login'); }}
                    className="bg-[#0b2545] hover:bg-[#134074] text-white px-5 py-2.5 rounded-lg font-bold inline-flex items-center gap-2 shadow cursor-pointer text-xs"
                  >
                    <span>Proceed to Admin Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Case B: Registration Open (Single Admin Registration) */
              <div>
                {/* Step Indicators */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      regStep === 1 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      1
                    </span>
                    <span className={`font-semibold text-[11px] ${regStep === 1 ? 'text-slate-900' : 'text-slate-400'}`}>
                      Profile Details
                    </span>
                  </div>
                  <div className="w-8 h-0.5 bg-slate-200"></div>
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      regStep === 2 ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      2
                    </span>
                    <span className={`font-semibold text-[11px] ${regStep === 2 ? 'text-slate-900' : 'text-slate-400'}`}>
                      Email OTP Verification
                    </span>
                  </div>
                </div>

                {regError && (
                  <div className="p-3 mb-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {/* STEP 1: Details Form */}
                {regStep === 1 && (
                  <form onSubmit={handleSendOTP} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Username (பயனர்பெயர்) *
                        </label>
                        <div className="relative">
                          <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                            placeholder="e.g. nodal_senthil"
                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Full Name (முழு பெயர்) *
                        </label>
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Dr. K. Senthil Kumar"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Official Email Address (மின்னஞ்சல்) *
                      </label>
                      <div className="relative">
                        <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="e.g. senthil.nodal@tn.gov.in"
                          className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                          required
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">
                        OTP verification code will be sent to this email address.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Phone Number (தொலைபேசி) *
                        </label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="tel"
                            value={regPhone}
                            onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile"
                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Location / District (இருப்பிடம்) *
                        </label>
                        <div className="relative">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                          <input
                            type="text"
                            value={regLocation}
                            onChange={(e) => setRegLocation(e.target.value)}
                            placeholder="e.g. Namakkal, Tamil Nadu"
                            className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Password (கடவுச்சொல்) *
                        </label>
                        <input
                          type="password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                          required
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-800 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:ring-1 focus:ring-emerald-600 text-slate-900 font-medium text-xs"
                          required
                        />
                      </div>
                    </div>

                    {/* Single Admin Policy Reminder */}
                    <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2 leading-relaxed">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>Important Security Rule:</strong> Only ONE administrator account is allowed. Once you register, this single admin account will possess exclusive administration control.
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={regSubmitting}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold py-2 rounded-lg shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                    >
                      {regSubmitting ? (
                        <span>Validating & Dispatching OTP...</span>
                      ) : (
                        <>
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Email Verification Code (OTP அனுப்பு)</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

                {/* STEP 2: Enter Email OTP */}
                {regStep === 2 && (
                  <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-950 text-xs flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Verification Code Sent:</strong>
                        <div className="text-[11px] text-emerald-800 mt-0.5">
                          {regSuccessMsg}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-800 mb-1">
                        Enter 6-Digit Verification Code (OTP)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        value={regOtp}
                        onChange={(e) => setRegOtp(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                        className="w-full text-center tracking-[8px] font-mono text-xl py-2 bg-slate-50 border-2 border-emerald-600 rounded-lg focus:bg-white focus:outline-none text-emerald-900 font-bold"
                        required
                        autoFocus
                      />
                    </div>

                    {/* Auto-fill Helper for instant grading / test presentation */}
                    {otpPreview && (
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between text-[11px] text-blue-900">
                        <span>
                          Test Preview Code: <strong>{otpPreview}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => setRegOtp(otpPreview)}
                          className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-0.5 rounded font-bold transition cursor-pointer"
                        >
                          Auto-fill OTP
                        </button>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setRegStep(1); setRegError(null); }}
                        className="px-3 py-2 border border-slate-300 rounded-md text-slate-600 hover:bg-slate-100 font-medium text-xs cursor-pointer"
                      >
                        ← Back to Edit
                      </button>

                      <button
                        type="submit"
                        disabled={regSubmitting || regOtp.length !== 6}
                        className="flex-1 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold py-2 rounded-md shadow transition flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        {regSubmitting ? (
                          <span>Verifying Code...</span>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                            <span>Verify OTP & Complete Admin Registration</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
