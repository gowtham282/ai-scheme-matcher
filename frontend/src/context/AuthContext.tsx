import React, { createContext, useContext, useState } from 'react';
import { User } from '../types/scheme';
import { loginWithCredentials as apiLoginWithCredentials } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  loginAsDemoCitizen: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  loginWithUserCredentials: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  adminAuthModalOpen: boolean;
  setAdminAuthModalOpen: (open: boolean) => void;
  openAdminAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('auth_token');
  });
  const [adminAuthModalOpen, setAdminAuthModalOpen] = useState(false);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const loginAsDemoCitizen = async () => {
    try {
      const res = await fetch('/api/auth/demo-login', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.user);
      }
    } catch (err) {
      console.error('Demo citizen login error:', err);
    }
  };

  const loginAsAdmin = async () => {
    try {
      const res = await fetch('/api/auth/admin-login', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        login(data.access_token, data.user);
      }
    } catch (err) {
      console.error('Admin login error:', err);
    }
  };

  const loginWithUserCredentials = async (usernameOrEmail: string, password: string) => {
    try {
      const data = await apiLoginWithCredentials(usernameOrEmail, password);
      login(data.access_token, data.user);
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const openAdminAuthModal = () => {
    setAdminAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loginAsDemoCitizen,
        loginAsAdmin,
        loginWithUserCredentials,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'admin' || user?.role === 'government_officer',
        adminAuthModalOpen,
        setAdminAuthModalOpen,
        openAdminAuthModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
