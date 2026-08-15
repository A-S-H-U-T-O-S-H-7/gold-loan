'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPageSizeChange,
  totalItems,
  itemsPerPage,
  pageSizeOptions = [10, 20, 50, 100],
  isDark = false
}) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 ${
      isDark ? 'border-gold-700/30' : 'border-gold-200'
    } border-t`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Show:
          </label>
          <select
            value={itemsPerPage}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            className={`px-2 py-1.5 rounded text-sm border focus:outline-none focus:ring-2 focus:ring-gold-500 ${
              isDark 
                ? 'bg-gray-700 text-gray-200 border-gold-600/50' 
                : 'bg-white text-gray-700 border-gold-300'
            }`}
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {totalItems > 0 ? (
            <>Showing <span className="font-medium">{startItem}-{endItem}</span> of <span className="font-medium">{totalItems}</span></>
          ) : (
            <span className="font-medium">No results</span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalItems === 0}
          className={`p-2 rounded transition-colors ${
            currentPage === 1 || totalItems === 0
              ? 'opacity-50 cursor-not-allowed'
              : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gold-100'
          } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-md'
                : page === '...'
                  ? 'cursor-default'
                  : isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gold-100'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalItems === 0}
          className={`p-2 rounded transition-colors ${
            currentPage === totalPages || totalItems === 0
              ? 'opacity-50 cursor-not-allowed'
              : isDark
                ? 'hover:bg-gray-700'
                : 'hover:bg-gold-100'
          } ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}