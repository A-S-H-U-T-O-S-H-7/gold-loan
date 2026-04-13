import React from "react";
import { Download, ExternalLink, FileImage, IdCard, UserSquare2 } from "lucide-react";

const fileConfigs = [
  { key: "selfie", label: "Photo", icon: UserSquare2 },
  { key: "aadhar_proof", label: "Aadhaar", icon: IdCard },
  { key: "address_proof", label: "Aadhaar Back", icon: FileImage },
  { key: "pan_proof", label: "PAN", icon: FileImage },
];

const EnquiryFilesCell = ({ enquiry, isDark }) => {
  const availableFiles = fileConfigs.filter(({ key }) => Boolean(enquiry?.[key]));

  if (availableFiles.length === 0) {
    return (
      <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        No files
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 min-w-[220px]">
      {availableFiles.map(({ key, label, icon: Icon }) => (
        <a
          key={key}
          href={enquiry[key]}
          target="_blank"
          rel="noreferrer"
          className={`rounded-xl border px-3 py-2 text-left transition-all duration-200 hover:scale-[1.02] ${
            isDark
              ? "border-gray-600 bg-gray-700/70 hover:border-crm-primary"
              : "border-gray-200 bg-gray-50 hover:border-crm-primary hover:bg-white"
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`} />
              <span className={`text-xs font-semibold truncate ${isDark ? "text-gray-100" : "text-gray-800"}`}>
                {label}
              </span>
            </div>
            <ExternalLink className={`w-3.5 h-3.5 shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
          </div>
          <div className={`mt-2 flex items-center gap-1 text-[11px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <Download className="w-3 h-3" />
            <span>Open file</span>
          </div>
        </a>
      ))}
    </div>
  );
};

export default EnquiryFilesCell;
