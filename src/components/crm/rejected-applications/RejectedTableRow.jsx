'use client';
import React from "react";
import { Calendar, Mail, Phone } from "lucide-react";
import StatusBadge from "@/components/crm/ui/StatusBadge";
import { formatCurrency } from "@/lib/utils/format";

const RejectedTableRow = ({
  application,
  index,
  isDark,
  onRestore,
  onView
}) => {
  const cellBase = "px-3 py-3 text-center border-r last:border-r-0";
  const cellBorder = isDark ? "border-gold-700/30" : "border-gold-200";
  const cellStyle = `${cellBase} ${cellBorder}`;

  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-600";
  const textAccent = isDark ? "text-gold-400" : "text-gold-600";
  const iconAccent = `w-4 h-4 ${textAccent}`;

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleRestore = () => {
    if (onRestore && application.id) {
      onRestore(application.id);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(application);
    }
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-md ${
        isDark
          ? "border-gold-700/30 hover:bg-gray-700/50"
          : "border-gold-100 hover:bg-gold-50/50"
      } ${
        index % 2 === 0
          ? isDark
            ? "bg-gray-800/50"
            : "bg-white"
          : isDark
            ? "bg-gray-800/30"
            : "bg-gold-50/30"
      }`}
    >
      {/* SR No */}
      <td className={cellStyle}>
        <span className={`font-medium ${textPrimary}`}>
          {application.srNo || index + 1}
        </span>
      </td>

      {/* Call Button - Soft Blue Gradient */}
      <td className={cellStyle}>
        <button
          onClick={() => window.location.href = `tel:${application.mobile}`}
          className={`cursor-pointer px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-1.5 text-white ${
            isDark
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
          } shadow-md hover:shadow-lg`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Call</span>
        </button>
      </td>

      {/* App ID */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm font-medium text-gold-600 dark:text-gold-400`}>
          {application.id || "—"}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {application.crnNo || "—"}
        </span>
      </td>

      {/* Enquiry Date */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-1.5">
          <Calendar className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {formatDate(application.enquiryDate)}
          </span>
        </div>
      </td>

      {/* Complete Date */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-1.5">
          <Calendar className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {formatDate(application.completeDate)}
          </span>
        </div>
      </td>

      {/* Rejected Date */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-1.5">
          <Calendar className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {formatDate(application.rejectedDate)}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {application.customer?.name || application.name || "—"}
        </span>
      </td>

      {/* Mobile */}
      <td className={cellStyle}>
        <span className={`font-mono text-sm ${textSecondary}`}>
          {application.customer?.mobile || application.mobile || "—"}
        </span>
      </td>

      {/* Email */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-1.5">
          <Mail className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {application.customer?.email || application.email || "—"}
          </span>
        </div>
      </td>

      {/* Loan Amount */}
      <td className={cellStyle}>
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-500/10 dark:bg-gold-500/20">
          <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">₹</span>
          <span className={`text-sm font-medium ${textPrimary}`}>
            {formatCurrency(application.loan?.amount || application.approvedAmount || 0)}
          </span>
        </div>
      </td>

      {/* ROI */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loan?.rate || application.roi || "—"}%
        </span>
      </td>

      {/* Tenure */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {application.loan?.tenure || application.tenure || "—"} months
        </span>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <StatusBadge status={application.status || "REJECTED"} />
      </td>

      {/* Rejected Reason */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary} line-clamp-2 max-w-[150px]`}>
          {application.rejectedReason || "—"}
        </span>
      </td>

      {/* Actions */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleView}
            className={`cursor-pointer px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                : "bg-gray-300 hover:bg-gray-400 text-gray-700"
            }`}
          >
            View
          </button>
          {/* Restore Button - Teal/Emerald Gradient */}
          <button
            onClick={handleRestore}
            className={`cursor-pointer px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200 hover:scale-105 flex items-center gap-1 text-white ${
              isDark
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
            } shadow-md hover:shadow-lg`}
          >
            <span>Re-store</span>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default RejectedTableRow;