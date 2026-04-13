"use client";

import Link from "next/link";
import { FileSearch } from "lucide-react";

const AppraisalReportButton = ({ enquiry, isDark, className = "" }) => {
  if (!enquiry?.id) {
    return <span className="text-xs text-gray-500">N/A</span>;
  }

  return (
    <Link
      href={`/crm/gold-evaluation/${enquiry.id}?view=appraisal`}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        isDark
          ? "border-pink-700 bg-pink-900/40 text-pink-200 hover:bg-pink-800"
          : "border-pink-300 bg-pink-100 text-pink-700 hover:bg-pink-200"
      } ${className}`}
    >
      <FileSearch className="h-3.5 w-3.5" />
      Appraisal
    </Link>
  );
};

export default AppraisalReportButton;
