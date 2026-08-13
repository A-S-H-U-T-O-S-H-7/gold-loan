"use client";
import React from 'react';
import { useThemeStore } from '@/lib/store/useThemeStore';

const Footer = () => {
  const { theme, } = useThemeStore();

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`py-2 px-4 border-t transition-colors duration-300 ${theme === "dark"
      ? 'bg-surface border-border text-foreground-muted'
      : 'bg-surface border-border text-foreground-muted'
      }`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Copyright section */}
          <div className={`text-xs ${theme === "dark" ? 'text-gray-500' : 'text-gray-400'
            }`}>
            © {currentYear} All Time Data. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

