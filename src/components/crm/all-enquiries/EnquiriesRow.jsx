import React from "react";
import { Calendar, Clock, Ban, CheckCircle, XCircle, Eye } from "lucide-react";
import Link from "next/link";
import PhotoDocument from "../documents/PhotoDocument";
import PanCardDocument from "../documents/PanCardDocument";
import AddressProofDocument from "../documents/AddressProofDocument";
import IdProofDocument from "../documents/IdProofDocument";

const EnquiriesRow = ({
  enquiry,
  index,
  isDark,
  sourcePage = "all"
}) => {
  const isBlacklisted = enquiry?.isBlacklisted;

  // Common cell styles
  const cellBase = "px-2 py-4 text-center border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = isDark ? "text-crm-primary-strong" : "text-crm-primary";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;
  
  const getStatusColor = (status = "") => {
    const statusLower = status.toLowerCase();

    if (statusLower.includes("pending")) {
      return isDark
        ? "bg-amber-900/30 text-amber-300 border-amber-700"
        : "bg-amber-100 text-amber-700 border-amber-300";
    }

    if (statusLower.includes("completed") || statusLower.includes("disbursed") || statusLower.includes("closed")) {
      return isDark
        ? "bg-green-900/30 text-green-300 border-green-700"
        : "bg-green-100 text-green-700 border-green-300";
    }

    if (statusLower.includes("rejected") || statusLower.includes("cancelled") || statusLower.includes("defaulter")) {
      return isDark
        ? "bg-red-900/30 text-red-300 border-red-700"
        : "bg-red-100 text-red-700 border-red-300";
    }

    if (statusLower.includes("processing") || statusLower.includes("verify") || statusLower.includes("sanction")) {
      return isDark
        ? "bg-blue-900/30 text-blue-300 border-blue-700"
        : "bg-blue-100 text-blue-700 border-blue-300";
    }

    return isDark
      ? "bg-gray-700 text-gray-200 border-gray-600"
      : "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getKYCStatusColor = (status = "pending") => {
    const statusLower = status?.toLowerCase() || "pending";
    
    if (statusLower === "verified") {
      return isDark
        ? "bg-green-900/30 text-green-300 border-green-700"
        : "bg-green-100 text-green-700 border-green-300";
    }
    
    if (statusLower === "rejected") {
      return isDark
        ? "bg-red-900/30 text-red-300 border-red-700"
        : "bg-red-100 text-red-700 border-red-300";
    }
    
    return isDark
      ? "bg-yellow-900/30 text-yellow-300 border-yellow-700"
      : "bg-yellow-100 text-yellow-700 border-yellow-300";
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${
        isBlacklisted 
          ? `${
              isDark 
                ? "bg-red-950/20 border-l-4 border-l-red-500" 
                : "bg-red-100 border-l-4 border-l-red-500"
            }`
          : isDark
              ? "border-crm-border hover:bg-gray-700/50"
              : "border-crm-border hover:bg-crm-accent-soft"
      } ${
        !isBlacklisted && index % 2 === 0
          ? isDark ? "bg-gray-700/30" : "bg-gray-50"
          : ""
      }`}
    >
      {/* SR No */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-1">
          {isBlacklisted && (
            <Ban className={`w-5 h-5 ${isDark ? "text-red-500" : "text-red-600"}`} />
          )}
          <span className={`font-medium ${textPrimary}`}>
            {enquiry.srNo}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={cellStyle}>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(enquiry.status)}`}>
          {enquiry.status}
        </span>
      </td>

      {/* Enquiry Source */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.enquirySource}
        </span>
      </td>

      {/* Branch */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.branch || "N/A"}
        </span>
      </td>

      {/* CRN No */}
      <td className={cellStyle}>
        <span className={`text-sm font-medium ${textAccent}`}>
          {enquiry.crnNo || "N/A"}
        </span>
      </td>

      {/* Enquiry Date */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-sm font-medium ${textSecondary}`}>
            {enquiry.enquiryDate}
          </span>
        </div>
      </td>

      {/* Enquiry Time */}
      <td className={cellStyle}>
        <div className="flex items-center justify-center space-x-2">
          <Clock className={iconAccent} />
          <span className={`text-sm ${textSecondary}`}>
            {enquiry.enquiryTime}
          </span>
        </div>
      </td>

      {/* Name */}
      <td className={cellStyle}>
        <span className={`font-medium text-sm ${textPrimary}`}>
          {enquiry.name}
        </span>
      </td>

      {/* Current Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentAddress || "N/A"}
        </span>
      </td>

      {/* Current State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentState || "N/A"}
        </span>
      </td>

      {/* Current City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.currentCity || "N/A"}
        </span>
      </td>

      {/* Address */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.address || "N/A"}
        </span>
      </td>

      {/* State */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.state}
        </span>
      </td>

      {/* City */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.city}
        </span>
      </td>

      {/* Phone No */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.phoneNo}
        </span>
      </td>

      {/* E-mail */}
      <td className={cellStyle}>
        <span className={`text-sm ${textSecondary}`}>
          {enquiry.email}
        </span>
      </td>

      {/* Photo */}
      <td className={cellStyle}>
        <PhotoDocument
          fileName={enquiry.selfie}
          hasDoc={enquiry.hasPhoto}
          isDark={isDark}
        />
      </td>

      {/* PAN Card */}
      <td className={cellStyle}>
        <PanCardDocument
          fileName={enquiry.pan_proof}
          hasDoc={enquiry.hasPanCard}
          isDark={isDark}
        />
      </td>

      {/* Address Proof */}
      <td className={cellStyle}>
        <AddressProofDocument
          fileName={enquiry.address_proof}
          hasDoc={enquiry.hasAddressProof}
          isDark={isDark}
        />
      </td>

      {/* ID Proof */}
      <td className={cellStyle}>
        <IdProofDocument
          fileName={enquiry.aadhar_proof}
          hasDoc={enquiry.hasIdProof}
          isDark={isDark}
        />
      </td>

      {/* KYC Status - Clickable Link to Edit */}
      <td className={cellStyle}>
        <Link
          href={`/crm/user-kyc/${enquiry.id}`}
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 hover:scale-105 gap-1 ${
            getKYCStatusColor(enquiry.kycStatus)
          }`}
        >
          <Eye className="w-3 h-3" />
          {enquiry.kycStatus === 'verified' ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Verified
            </>
          ) : enquiry.kycStatus === 'rejected' ? (
            <>
              <XCircle className="w-3 h-3" />
              Rejected
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Pending
            </>
          )}
        </Link>
      </td>
    </tr>
  );
};

export default EnquiriesRow;
