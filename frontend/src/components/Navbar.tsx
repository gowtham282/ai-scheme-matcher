import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, Compass, CheckSquare, MapPin, 
  FileText, HelpCircle, ShieldCheck, Bookmark, User as UserIcon, 
  Globe, Sun, Moon, Menu, X, Sparkles, LogOut, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { Language } from '../i18n/translations';
import { AdminAuthModal } from './AdminAuthModal';

export const Navbar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { fontScale, increaseFontSize, decreaseFontSize, resetFontSize, highContrast, toggleHighContrast } = useAccessibility();
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    logout, 
    loginAsDemoCitizen, 
    loginAsAdmin,
    adminAuthModalOpen,
    setAdminAuthModalOpen,
    openAdminAuthModal
  } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemoModeClick = async () => {
    await loginAsDemoCitizen();
    navigate('/smart-matcher?mode=demo');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-md bg-white border-b border-slate-200">
      {/* Tricolor Government Top Strip */}
      <div className="h-1.5 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      {/* Top Accessibility & Government Identification Bar */}
      <div className="bg-[#0b2545] text-slate-100 text-xs px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-wide flex items-center gap-1.5 text-amber-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              GOVERNMENT OF INDIA DIGITAL SERVICE INITIATIVE
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Accessibility Font Resizer */}
            <div className="flex items-center space-x-1 bg-[#13293d] rounded px-1.5 py-0.5 border border-slate-700">
              <span className="text-[11px] text-slate-300 mr-1 hidden sm:inline">Text Size:</span>
              <button 
                onClick={decreaseFontSize} 
                title="Decrease font size"
                className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold"
              >
                A-
              </button>
              <button 
                onClick={resetFontSize} 
                title="Reset font size"
                className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold text-amber-300"
              >
                A
              </button>
              <button 
                onClick={increaseFontSize} 
                title="Increase font size"
                className="px-1.5 py-0.5 hover:bg-slate-700 rounded font-bold"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              onClick={toggleHighContrast}
              title="Toggle High Contrast for Accessibility"
              className="flex items-center gap-1 hover:text-amber-300 px-1.5 py-0.5 rounded transition"
            >
              {highContrast ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px]">Contrast</span>
            </button>

            {/* Multilingual Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 bg-[#13293d] px-2 py-0.5 rounded border border-slate-700 hover:border-slate-500 transition font-medium"
              >
                <Globe className="w-3.5 h-3.5 text-sky-400" />
                <span>{language === 'en' ? 'English' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white text-slate-900 shadow-lg rounded border border-slate-200 py-1 z-50">
                  <button
                    onClick={() => { setLanguage('en'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 ${language === 'en' ? 'font-bold text-blue-900 bg-blue-50' : ''}`}
                  >
                    English {language === 'en' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('ta'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 ${language === 'ta' ? 'font-bold text-blue-900 bg-blue-50' : ''}`}
                  >
                    தமிழ் (Tamil) {language === 'ta' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                  <button
                    onClick={() => { setLanguage('hi'); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-100 ${language === 'hi' ? 'font-bold text-blue-900 bg-blue-50' : ''}`}
                  >
                    हिन्दी (Hindi) {language === 'hi' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Official Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand & Portal Title */}
        <Link to="/" className="group block">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Marginalized Entrepreneurs
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-[#0b2545] leading-tight group-hover:text-blue-700 transition">
              {t.portalTitle}
            </h1>
          </div>
        </Link>

        {/* Quick Demo CTA & Auth controls */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* AI Assistant Mode Trigger */}
          <button
            onClick={handleDemoModeClick}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-sm transition transform active:scale-95 cursor-pointer"
            title="Instant 1-Click AI Assistant Scheme Assessment"
          >
            <Sparkles className="w-4 h-4 text-amber-100" />
            <span>AI Assistant Mode</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <Link
                to={isAdmin ? "/admin" : "/profile"}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-blue-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition"
              >
                <UserIcon className="w-3.5 h-3.5 text-blue-700" />
                <span className="max-w-[120px] truncate">{user?.full_name}</span>
                {isAdmin && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.2 rounded">Officer</span>}
              </Link>
              <button
                onClick={logout}
                title="Logout"
                className="p-1.5 text-slate-500 hover:text-red-600 rounded transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={openAdminAuthModal}
                className="text-xs text-slate-600 hover:text-[#0b2545] border border-slate-300 hover:border-slate-400 px-2.5 py-1.5 rounded transition font-medium cursor-pointer"
              >
                {t.adminLogin}
              </button>
              <button
                onClick={loginAsDemoCitizen}
                className="text-xs bg-[#0b2545] hover:bg-[#134074] text-white px-3 py-1.5 rounded transition font-medium cursor-pointer"
              >
                {t.login}
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-[#0b2545] focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Main Navigation Bar */}
      <nav className="bg-[#0b2545] text-white border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="hidden lg:flex items-center space-x-1 py-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              {t.home}
            </Link>

            <Link
              to="/schemes"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/schemes') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.exploreAllSchemes}</span>
            </Link>

            <Link
              to="/smart-matcher"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/smart-matcher') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.smartMatcher}</span>
            </Link>

            <Link
              to="/eligibility"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/eligibility') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{t.eligibilityChecker}</span>
            </Link>

            <Link
              to="/partners"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/partners') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{t.partnerFinder}</span>
            </Link>

            <Link
              to="/tracking"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/tracking') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.applicationTracking}</span>
            </Link>

            <Link
              to="/documents"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/documents') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t.requiredDocuments}</span>
            </Link>

            <Link
              to="/sources"
              className={`px-3 py-2 rounded text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                isActive('/sources') ? 'bg-amber-500 text-slate-950 shadow-inner' : 'hover:bg-white/10 text-slate-100'
              }`}
            >
              <span>{t.sourcesVerification}</span>
            </Link>

            {isAdmin ? (
              <Link
                to="/admin"
                className={`ml-auto px-3 py-2 rounded text-xs font-bold tracking-wide transition flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
              </Link>
            ) : (
              <button
                onClick={openAdminAuthModal}
                className={`ml-auto px-3 py-2 rounded text-xs font-bold tracking-wide transition flex items-center gap-1.5 text-amber-300 hover:text-white hover:bg-white/10 cursor-pointer`}
                title="Administrator & Nodal Officer Portal Login"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>

          {/* Mobile navigation links */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-3 space-y-1 border-t border-slate-700">
              <button
                onClick={() => { handleDemoModeClick(); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assistant Mode</span>
              </button>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.home}
              </Link>
              <Link
                to="/schemes"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.exploreAllSchemes}
              </Link>
              <Link
                to="/smart-matcher"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded text-amber-300 font-bold"
              >
                {t.smartMatcher}
              </Link>
              <Link
                to="/eligibility"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.eligibilityChecker}
              </Link>
              <Link
                to="/partners"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.partnerFinder}
              </Link>
              <Link
                to="/tracking"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.applicationTracking}
              </Link>
              <Link
                to="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.requiredDocuments}
              </Link>
              <Link
                to="/sources"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.sourcesVerification}
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-medium hover:bg-slate-800 rounded"
              >
                {t.about}
              </Link>

              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-xs font-bold bg-emerald-700 text-white rounded flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Portal</span>
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdminAuthModal();
                  }}
                  className="w-full text-left block px-3 py-2 text-xs font-bold text-amber-300 hover:bg-slate-800 rounded flex items-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Admin Portal / Register</span>
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Admin Authentication & Registration Modal */}
      <AdminAuthModal
        isOpen={adminAuthModalOpen}
        onClose={() => setAdminAuthModalOpen(false)}
      />
    </header>
  );
};
