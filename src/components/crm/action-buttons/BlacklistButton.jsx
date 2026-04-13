"use client";

import { Ban } from "lucide-react";

const BlacklistButton = ({ application, isDark, onBlacklist }) => {
  const isBlacklisted = application?.isBlacklisted;

  return (
    <button
      type="button"
      disabled={isBlacklisted}
      onClick={onBlacklist}
      className={`inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold transition-all duration-200 ${
        isBlacklisted
          ? "cursor-not-allowed border-red-500 bg-red-500 text-white opacity-80"
          : isDark
            ? "border-red-700 bg-red-900/40 text-red-200 hover:bg-red-800"
            : "border-red-300 bg-red-100 text-red-700 hover:bg-red-200"
      }`}
    >
      <Ban className="h-3.5 w-3.5" />
      {isBlacklisted ? "Blacklisted" : "Blacklist"}
    </button>
  );
};

export default BlacklistButton;
