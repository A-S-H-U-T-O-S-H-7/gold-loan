"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock, Building2, Sun, Moon, Gem } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

export default function AdminLogin() {
  const { theme, toggleTheme } = useThemeStore();
  const { isAuthenticated, loading, error, login } = useAdminAuthStore();
  const router = useRouter();
  const [formData, setFormData] = useState({
    branch_id: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/crm/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      branch_id: parseInt(formData.branch_id),
      username: formData.username,
      password: formData.password
    });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${theme === "dark" ? "dark bg-background" : "bg-gradient-to-br from-gold-50/50 via-navy-50/30 to-background"}`}>
      
      {/* Theme Toggle - Gold Styled */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 
          ${theme === "dark" 
            ? 'bg-surface hover:bg-surface-hover text-gold-400 border border-border' 
            : 'bg-white hover:bg-gold-50 text-gold-600 shadow-lg border border-gold-200/50 hover:border-gold-300'
          }`}
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Login Card */}
      <div className={`w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-300 
        ${theme === "dark" 
          ? 'bg-surface border border-border' 
          : 'bg-white/80 backdrop-blur-sm border border-gold-100/50'
        }`}>
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center 
            ${theme === "dark" ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-gold-50 border border-gold-200'}`}>
            <Gem className={`w-10 h-10 ${theme === "dark" ? 'text-gold-400' : 'text-gold-600'}`} />
          </div>
          
          <h1 className="text-3xl font-serif font-bold gold-gradient-text">
            Gold Loan CRM
          </h1>
          <p className={`mt-2 text-sm ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-500/70'}`}>
            Sign in to your dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Branch ID */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? 'text-foreground-secondary' : 'text-navy-700'}`}>
              Branch ID
            </label>
            <div className="relative">
              <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`} />
              <input
                type="number"
                name="branch_id"
                required
                value={formData.branch_id}
                onChange={handleInputChange}
                placeholder="Enter branch ID"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 
                  focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none
                  ${theme === "dark" 
                    ? 'bg-background-secondary border-border text-foreground placeholder-foreground-muted' 
                    : 'bg-white border-gold-200/50 text-navy-900 placeholder-navy-400'
                  }`}
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? 'text-foreground-secondary' : 'text-navy-700'}`}>
              Username
            </label>
            <div className="relative">
              <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`} />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 
                  focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none
                  ${theme === "dark" 
                    ? 'bg-background-secondary border-border text-foreground placeholder-foreground-muted' 
                    : 'bg-white border-gold-200/50 text-navy-900 placeholder-navy-400'
                  }`}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className={`block text-sm font-medium mb-1.5 ${theme === "dark" ? 'text-foreground-secondary' : 'text-navy-700'}`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 
                  focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500 outline-none
                  ${theme === "dark" 
                    ? 'bg-background-secondary border-border text-foreground placeholder-foreground-muted' 
                    : 'bg-white border-gold-200/50 text-navy-900 placeholder-navy-400'
                  }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 
              bg-gold-500 hover:bg-gold-600 focus:ring-4 focus:ring-gold-300/50 
              disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center
              ${theme === "dark" ? 'bg-gold-400 hover:bg-gold-500' : ''}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`text-xs ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`}>
            Demo login: Branch <span className="font-mono">1</span> / <span className="font-mono">admin</span> / <span className="font-mono">admin</span>
          </p>
        </div>
      </div>
    </div>
  );
}