"use client"
import { useState } from "react";

const AdvancedSearchBar = ({ 
  searchOptions, 
  onSearch, 
  isDark,
  placeholder = "Enter search term...",
  buttonText = "Search"
}) => {
  const [selectedField, setSelectedField] = useState(searchOptions[0]?.value || "");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedField || !searchTerm.trim()) return;
    
    onSearch({
      field: selectedField,
      term: searchTerm.trim()
    });
  };

  const handleClear = () => {
    setSearchTerm("");
    setSelectedField(searchOptions[0]?.value || "");
    onSearch({
      field: "",
      term: ""
    });
  };

  const isSearchEnabled = selectedField && searchTerm.trim();

  return (
    <div className={`rounded-xl p-1 transition-all duration-300 ${
      isDark 
        ? "bg-gradient-to-r from-crm-primary/20 to-crm-gradient-to/20 border border-crm-border" 
        : "bg-gradient-to-r from-crm-accent-soft to-crm-primary-soft border border-crm-border"
    }`}>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        {/* Search Field Dropdown */}
        <select
          value={selectedField}
          onChange={(e) => setSelectedField(e.target.value)}
          className={`px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 transition-all duration-200 font-medium flex-shrink-0 text-sm md:text-base ${
            isDark
              ? "bg-gray-800 border-crm-border text-white hover:border-crm-primary focus:border-crm-primary-strong"
              : "bg-white border-crm-border text-gray-900 hover:border-crm-primary focus:border-crm-primary"
          } focus:ring-1 focus:ring-crm-ring focus:outline-none`}
        >
          {searchOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Search Input and Buttons Container */}
        <div className="flex-1 flex flex-col sm:flex-row gap-2">
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholder}
            className={`flex-1 px-3 md:px-4 py-2 md:py-3 rounded-lg border-2 transition-all duration-200 font-medium text-sm md:text-base ${
              isDark
                ? "bg-gray-800 border-crm-border text-white placeholder-gray-400 hover:border-crm-primary focus:border-crm-primary-strong"
                : "bg-white border-crm-border text-gray-900 placeholder-gray-500 hover:border-crm-primary focus:border-crm-primary"
            } focus:ring-1 focus:ring-crm-ring focus:outline-none`}
          />

          {/* Buttons Container */}
          <div className="flex gap-2">
            {/* Search Button */}
            <button
              type="submit"
              disabled={!isSearchEnabled}
              className={`flex-1 sm:flex-initial px-3 md:px-6 py-2 md:py-3 rounded-lg font-medium md:font-semibold transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base ${
                isDark
                  ? "bg-gradient-to-r from-crm-gradient-from to-crm-gradient-to hover:brightness-110 text-white"
                  : "bg-gradient-to-r from-crm-gradient-from to-crm-gradient-to hover:brightness-110 text-white"
              } shadow-lg hover:shadow-xl disabled:shadow-none`}
            >
              {buttonText}
            </button>

            {/* Clear Button */}
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className={`flex-1 sm:flex-initial px-3 md:px-4 py-2 md:py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 text-sm md:text-base ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300"
                }`}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdvancedSearchBar;
