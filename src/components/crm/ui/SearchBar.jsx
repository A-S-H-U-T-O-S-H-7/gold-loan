'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  searchOptions,
  onSearch,
  placeholder = "Search...",
  buttonText = "Search",
  isDark = false
}) {
  const [selectedField, setSelectedField] = useState(searchOptions[0]?.value || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    onSearch({ field: selectedField, term: searchTerm.trim() });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedField(searchOptions[0]?.value || "");
    onSearch({ field: "", term: "" });
  };

  return (
    <div className={`rounded-xl p-1 transition-all duration-300 mb-6 ${
      isDark 
        ? 'bg-gold-500/10 border border-gold-600/30' 
        : 'bg-white/80 border border-gold-200 shadow-sm'
    }`}>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 py-2">
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className={`px-3 md:px-4 py-2 md:py-2.5 rounded-lg border-2 transition-all duration-200 font-medium flex-shrink-0 text-sm md:text-base cursor-pointer ${
            isDark
              ? 'bg-gray-800 border-gold-600/50 text-white hover:border-gold-500 focus:border-gold-400'
              : 'bg-white border-gold-300 text-gray-900 hover:border-gold-400 focus:border-gold-500'
          } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
        >
          {searchOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className="flex-1 flex flex-col sm:flex-row gap-2 md:w-1/2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-lg border-2 transition-all duration-200 font-medium text-sm md:text-base ${
              isDark
                ? 'bg-gray-800 border-gold-600/50 text-white placeholder-gray-400 hover:border-gold-500 focus:border-gold-400'
                : 'bg-white border-gold-300 text-gray-900 placeholder-gray-500 hover:border-gold-400 focus:border-gold-500'
            } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
          />
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!searchTerm.trim()}
              className={`flex-1 sm:flex-initial px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm md:text-base text-white shadow-lg hover:shadow-xl disabled:shadow-none ${
                isDark
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
              }`}
            >
              <Search className="w-4 h-4 inline mr-1" />
              {buttonText}
            </button>
            
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className={`flex-1 sm:flex-initial px-3 md:px-4 py-2 md:py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 cursor-pointer text-sm md:text-base ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}