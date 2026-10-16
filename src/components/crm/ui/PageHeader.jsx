'use client';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PageHeader({ 
  title, 
  count, 
  showBack = true,
  actions = null,
  isDark = false
}) {
  const router = useRouter();

  return (
    <div className="mb-6 flex min-w-0 flex-col flex-wrap items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {showBack && (
          <button
            onClick={() => router.back()}
            className={`cursor-pointer p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
              isDark
                ? 'bg-gold-500/10 border border-gold-600/30 hover:bg-gold-500/20'
                : 'bg-gold-50 border border-gold-200 hover:bg-gold-100'
            }`}
          >
            <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gold-400' : 'text-gold-600'}`} />
          </button>
        )}
        <h1 className={`min-w-0 text-xl font-bold sm:text-2xl md:text-3xl ${
          isDark ? 'text-gray-100' : 'text-gray-900'
        }`}>
          {title}
          {count !== undefined && (
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              {' '}({count})
            </span>
          )}
        </h1>
      </div>
      
      {actions && (
        <div className="flex gap-2 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </div>
  );
}
