"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import AdminHeader from '@/components/crm/Header';
import Sidebar from '@/components/crm/Sidebar';
import Footer from '@/components/crm/Footer';

export default function CRMLayout({ children }) {
  const { theme } = useThemeStore();
  const { isAuthenticated, loading } = useAdminAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/crm");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          {/* Gold Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-foreground-secondary text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`min-h-screen bg-background ${theme === "dark" ? 'dark' : ''}`}>
      <Toaster 
        position="top-right"
        toastOptions={{
          className: 'bg-surface text-foreground border border-border',
          duration: 4000,
        }}
      />
      
      <div className="min-h-screen">
        <Sidebar />

        <div className="flex flex-col min-h-screen lg:ml-20">
          <AdminHeader />

          <main className="flex-1 p-4 md:p-6 bg-background">
            <div className="max-w-[1400px] mx-auto w-full">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}