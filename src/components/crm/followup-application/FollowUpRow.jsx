import React from "react";
import { Ban, Calendar, Mail } from "lucide-react";
import PhotoDocument from "../documents/PhotoDocument";
import PanCardDocument from "../documents/PanCardDocument";
import AddressProofDocument from "../documents/AddressProofDocument";
import IdProofDocument from "../documents/IdProofDocument";
import ActionButton from "../action-buttons/ActionButton";
import AppraisalReportButton from "../action-buttons/AppraisalReportButton";
import EligibilityButton from "../action-buttons/EligibilityButton";
import CRNLink from "../CRNLink";
import CallButton from "../call/CallButton";
import BlacklistButton from "../action-buttons/BlacklistButton";

const FollowUpRow = ({
  application,
  index,
  isDark,
  onOpenStatusModal,
  onBlacklist,
}) => {
  const isBlacklisted = application.isBlacklisted;
  const cellStyle = `px-2 py-4 text-center border-r ${
    isDark ? "border-gray-600/80" : "border-gray-300/90"
  }`;
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-emerald-400" : "text-emerald-600";

  const formatCurrency = (amount) => Number(amount || 0).toLocaleString("en-IN");

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isBlacklisted 
          ? isDark
            ? "border-emerald-700 bg-red-950/20 hover:bg-red-900/30"
            : "border-emerald-300 bg-red-100 hover:bg-red-50"
          : index % 2 === 0
          ? isDark
            ? "border-crm-border bg-gray-700/30 hover:bg-gray-700/50"
            : "border-crm-border bg-gray-50 hover:bg-crm-accent-soft/50"
          : isDark
            ? "border-crm-border hover:bg-gray-700/50"
            : "border-crm-border hover:bg-crm-accent-soft/50"
      }`}
    >
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-1">
          {isBlacklisted && <Ban className="h-5 w-5 text-red-500" />}
          <span className={`font-medium ${textPrimary}`}>{application.srNo}</span>
        </div>
      </td>
      <td className={cellStyle}>
        <CallButton applicant={application} isDark={isDark} size="small" variant="default" className="px-5 py-2 rounded-md text-sm font-semibold border transition-all duration-200 hover:scale-105" />
      </td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.enquirySource || "N/A"}</span></td>
      <td className={cellStyle}><CRNLink crnNo={application.crnNo} userId={application.id} /></td>
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-2">
          <Calendar className={`h-4 w-4 ${textAccent}`} />
          <span className={`text-sm ${textSecondary}`}>{application.enquiryDate}</span>
        </div>
      </td>
      <td className={cellStyle}><span className={`font-medium text-sm ${textPrimary}`}>{application.name}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.currentAddress}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.currentState}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.currentCity}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.permanentAddress}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.state}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.city}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.phoneNo}</span></td>
      <td className={cellStyle}>
        <div className="flex items-center justify-center gap-2">
          <Mail className={`h-4 w-4 ${textAccent}`} />
          <span className={`text-sm ${textSecondary}`}>{application.email}</span>
        </div>
      </td>
      <td className={cellStyle}><span className={`text-sm font-semibold ${isDark ? "text-green-400" : "text-green-700"}`}>Rs {formatCurrency(application.goldAmount)}</span></td>
      <td className={cellStyle}><span className={`text-sm font-semibold ${isDark ? "text-orange-300" : "text-orange-700"}`}>Rs {formatCurrency(application.approvedAmount)}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.roi || "N/A"}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.tenure || "N/A"}</span></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.loanTerm}</span></td>
      <td className={cellStyle}><PhotoDocument fileName={application.photoFileName} hasDoc={application.hasPhoto} isDark={isDark} /></td>
      <td className={cellStyle}><PanCardDocument fileName={application.panCardFileName} hasDoc={application.hasPanCard} isDark={isDark} /></td>
      <td className={cellStyle}><AddressProofDocument fileName={application.addressProofFileName} hasDoc={application.hasAddressProof} isDark={isDark} /></td>
      <td className={cellStyle}><IdProofDocument fileName={application.idProofFileName} hasDoc={application.hasIdProof} isDark={isDark} /></td>
      <td className={cellStyle}><span className={`text-sm ${textSecondary}`}>{application.approvalNote || "N/A"}</span></td>
      <td className={cellStyle}>
        <button
          onClick={() => onOpenStatusModal?.(application)}
          className={`rounded px-3 py-1 text-xs font-medium ${
            isDark ? "border border-rose-700 bg-rose-200 text-rose-900" : "border border-rose-300 bg-rose-100 text-rose-700"
          }`}
        >
          {application.loanStatus}
        </button>
      </td>
      <td className={cellStyle}><ActionButton enquiry={application} isDark={isDark} /></td>
      <td className={cellStyle}><AppraisalReportButton enquiry={application} isDark={isDark} /></td>
      <td className={cellStyle}><EligibilityButton enquiry={application} isDark={isDark} /></td>
      <td className={cellStyle}>
        <BlacklistButton application={application} isDark={isDark} onBlacklist={() => onBlacklist?.(application)} />
      </td>
    </tr>
  );
};

export default FollowUpRow;
