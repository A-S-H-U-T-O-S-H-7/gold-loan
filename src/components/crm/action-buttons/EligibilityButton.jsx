"use client";

import Link from "next/link";
import { Gem } from "lucide-react";

const EligibilityButton = ({ enquiry, isDark, className = "" }) => {
  if (!enquiry?.id) {
    return <span className="text-xs text-gray-500">N/A</span>;
  }

  return (
    <Link
      href={`/crm/gold-evaluation/${enquiry.id}?view=gold`}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        isDark
          ? "border-teal-700 bg-teal-900/40 text-teal-200 hover:bg-teal-800"
          : "border-teal-300 bg-teal-100 text-teal-700 hover:bg-teal-200"
      } ${className}`}
    >
      <Gem className="h-3.5 w-3.5" />
      Gold Eval
    </Link>
  );
};

export default EligibilityButton;
