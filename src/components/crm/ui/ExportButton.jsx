'use client';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { exportToExcel } from '@/lib/utils/exportutil';

export default function ExportButton({
  data,
  filename,
  headers,
  isDark = false,
  disabled = false,
  onExport
}) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (disabled || !data || data.length === 0) return;
    
    setExporting(true);
    try {
      if (onExport) {
        await onExport();
      } else {
        const exportData = [headers, ...data.map(row => headers.map(h => row[h]))];
        exportToExcel(exportData, filename);
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting || !data || data.length === 0}
      className={`px-4 py-2 rounded-sm font-medium transition-all duration-200 flex items-center gap-2 ${
        disabled || exporting || !data || data.length === 0
          ? 'opacity-50 cursor-not-allowed'
          : `text-white shadow-lg hover:shadow-xl hover:scale-105 ${
              isDark
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
            }`
      }`}
    >
      <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
      <span>{exporting ? 'Exporting...' : 'Export'}</span>
    </button>
  );
}