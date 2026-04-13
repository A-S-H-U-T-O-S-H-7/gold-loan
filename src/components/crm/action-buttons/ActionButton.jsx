"use client";

import Link from "next/link";
import { FilePenLine } from "lucide-react";

const ActionButton = ({ enquiry, isDark, className = "" }) => {
  if (!enquiry?.id) {
    return <span className="text-xs text-gray-500">N/A</span>;
  }

  return (
    <Link
      href={`/crm/user-kyc/${enquiry.id}`}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        isDark
          ? "border-blue-700 bg-blue-900/40 text-blue-200 hover:bg-blue-800"
          : "border-blue-300 bg-blue-100 text-blue-700 hover:bg-blue-200"
      } ${className}`}
    >
      <FilePenLine className="h-3.5 w-3.5" />
      Edit
    </Link>
  );
};

export default ActionButton;
