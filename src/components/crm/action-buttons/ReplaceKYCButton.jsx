"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

const ReplaceKYCButton = ({ application, isDark }) => {
  if (!application?.id) {
    return <span className="text-xs text-gray-500">N/A</span>;
  }

  return (
    <Link
      href={`/crm/user-kyc/${application.id}`}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 hover:scale-105 ${
        isDark
          ? "border-violet-700 bg-violet-900/40 text-violet-200 hover:bg-violet-800"
          : "border-violet-300 bg-violet-100 text-violet-700 hover:bg-violet-200"
      }`}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      Replace KYC
    </Link>
  );
};

export default ReplaceKYCButton;
