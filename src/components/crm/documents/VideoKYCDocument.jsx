"use client";

import React, { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import Link from "next/link";
import api from "@/utils/axiosInsatnce";

const VideoKYCDocument = ({
  fileName,
  hasDoc,
  isDark,
  applicationId,
  userId,
  approvalNote,
  className = "",
  size = "default"
}) => {
  const [isLoadingFallback, setIsLoadingFallback] = useState(false);

  const sizeClasses = {
    small: "p-1.5",
    default: "p-2",
    large: "p-3"
  };

  const iconSizes = {
    small: 16,
    default: 18,
    large: 20
  };

  const normalizedApprovalNote = String(approvalNote || "").trim().toLowerCase();
  const canUseExistingCustomerFallback =
    !hasDoc &&
    !fileName &&
    !!userId &&
    normalizedApprovalNote === "existing customer";

  const openVideoDocument = (videoFileName) => {
    const url = `/documents/view?file=${encodeURIComponent(videoFileName)}&type=video_kyc${applicationId ? `&appId=${applicationId}` : ""}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleExistingCustomerVideoOpen = async () => {
    if (!canUseExistingCustomerFallback || isLoadingFallback) {
      return;
    }

    try {
      setIsLoadingFallback(true);

      const response = await api.get(`/crm/application/link/video/${userId}`);
      const videoRecords = Array.isArray(response?.data) ? response.data : [];

      const matchedVideo =
        videoRecords.find(
          (item) => String(item.application_id) === String(applicationId) && item.video
        )?.video ||
        videoRecords.find((item) => item.video)?.video;

      if (!matchedVideo) {
        throw new Error("No linked video found for this existing customer");
      }

      openVideoDocument(matchedVideo);
    } catch (error) {
      console.error("Failed to fetch existing customer video link:", error);
    } finally {
      setIsLoadingFallback(false);
    }
  };

  if (!hasDoc || !fileName) {
    if (canUseExistingCustomerFallback) {
      return (
        <button
          type="button"
          onClick={handleExistingCustomerVideoOpen}
          disabled={isLoadingFallback}
          className={`${sizeClasses[size]} rounded-lg cursor-pointer transition-colors flex items-center justify-center group relative ${
            isLoadingFallback
              ? "bg-gray-400 text-white cursor-wait"
              : isDark
                ? "bg-gradient-to-r from-amber-900/60 to-orange-800/60 text-amber-200 hover:from-amber-800/70 hover:to-orange-700/70"
                : "bg-gradient-to-r from-amber-100 to-orange-200 text-amber-700 hover:from-amber-200 hover:to-orange-300"
          } ${className}`}
          title={isLoadingFallback ? "Loading existing customer video..." : "Open linked Video KYC from existing customer history"}
        >
          <Play size={iconSizes[size]} className="flex-shrink-0" />
          <ExternalLink
            size={size === "small" ? 8 : 10}
            className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </button>
      );
    }

    return (
      <div
        className={`p-2 rounded-lg bg-red-100 text-red-600 flex items-center justify-center cursor-not-allowed ${className}`}
        title={`Video KYC Missing: ${fileName || "No file"}`}
      >
        <Play size={size === "small" ? 16 : size === "large" ? 20 : 18} className="flex-shrink-0" />
        <span className="text-xs ml-1">x</span>
      </div>
    );
  }

  return (
    <Link
      href={`/documents/view?file=${encodeURIComponent(fileName)}&type=video_kyc${applicationId ? `&appId=${applicationId}` : ""}`}
      target="_blank"
      className={`${sizeClasses[size]} rounded-lg transition-colors cursor-pointer flex items-center justify-center group relative ${
        isDark
          ? "bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 text-emerald-300"
          : "bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700"
      } ${className}`}
      title="View Video KYC"
    >
      <Play
        size={iconSizes[size]}
        className="flex-shrink-0"
      />
      <ExternalLink
        size={size === "small" ? 8 : 10}
        className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </Link>
  );
};

export default VideoKYCDocument;
