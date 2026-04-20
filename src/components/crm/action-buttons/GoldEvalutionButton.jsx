'use client';
import React from "react";
import Link from "next/link";
import { Gem } from "lucide-react";

const GoldEvaluationButton = ({ 
  enquiry,
  isDark,
  loading = false,
  disabled = false,
  className = "",
  sourcePage = "all"
}) => {

  if (!enquiry) {
    return (
      <span className={`px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs ${className}`}>
        N/A
      </span>
    );
  }

  return (
    <>
      <Link
        href={`/crm/gold-evaluation/${enquiry.id}?source=${sourcePage}`}
        rel="noopener noreferrer"
        onClick={(e) => {
          localStorage.setItem('selectedEnquiry', JSON.stringify(enquiry));
          if (!e.ctrlKey && !e.metaKey && !e.shiftKey && (disabled || loading)) {
            e.preventDefault();
          }
        }}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all duration-200 border
          ${disabled || loading
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:scale-105"}
          ${isDark
            ? "bg-amber-900/50 border-amber-700 text-amber-300 hover:bg-amber-800"
            : "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"}
          ${className}`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <Gem className="h-3.5 w-3.5" />
            <span>Gold Eval</span>
          </>
        )}
      </Link>
    </>
  );
};

export default GoldEvaluationButton;