"use client";

import api from "@/utils/axiosInsatnce";

export const goldEvaluationAPI = {
  getApplication: async (applicationId) => {
    try {
      return await api.get(`/crm/appraisal/edit/${applicationId}`);
    } catch (error) {
      throw error;
    }
  },
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB");
};

const formatAddress = (parts = []) => {
  const value = parts.filter(Boolean).join(", ").trim();
  return value || "N/A";
};

export const formatGoldEvaluationForUI = (payload = {}) => {
  const application = payload.application || payload.data?.application || {};
  const golds = application.golds || [];

  return {
    id: application.id,
    userId: application.user_id,
    crnNo: application.crnno || "N/A",
    name: application.fullname || "N/A",
    dob: formatDate(application.dob),
    gender: application.gender || "N/A",
    phone: application.phone || "N/A",
    email: application.email || "N/A",
    altMobile: application.alt_mobile || "N/A",
    panNo: application.pan_no || "N/A",
    aadharNo: application.aadhar_no || "N/A",
    loanNo: application.loan_no || "N/A",
    goldAmount: formatCurrency(application.gold_amount),
    approvedAmount: formatCurrency(application.approved_amount),
    roi: application.roi ?? "N/A",
    tenure: application.tenure ?? "N/A",
    loanTerm: application.loan_term === 4 ? "One Time Payment" : application.loan_term ?? "N/A",
    approvalNote: application.approval_note || "N/A",
    permanentAddress: formatAddress([
      application.house_no,
      application.address,
      application.city,
      application.state,
      application.pincode,
    ]),
    currentAddress: formatAddress([
      application.current_house_no,
      application.current_address,
      application.current_city,
      application.current_state,
      application.current_pincode,
    ]),
    bank: {
      bankName: application.bank_name || "N/A",
      branchName: application.branch_name || "N/A",
      accountType: application.account_type || "N/A",
      accountNo: application.account_no || "N/A",
      ifscCode: application.ifsc_code || "N/A",
      bankVerified: application.bankVerif === 1 ? "Verified" : "Pending",
    },
    nominee: {
      name: application.nominee_name || "N/A",
      relation: application.nominee_relation || "N/A",
      dob: formatDate(application.nominee_dob),
      gender: application.nominee_gender || "N/A",
      mobile: application.nominee_mobile || "N/A",
      email: application.nominee_email || "N/A",
      aadharNo: application.nominee_aadhar_no || "N/A",
      panNo: application.nominee_pan_no || "N/A",
    },
    golds: golds.map((gold, index) => ({
      id: gold.id || index + 1,
      goldType: gold.gold_type || "N/A",
      itemName: gold.item_name || "N/A",
      purity: gold.purity || "N/A",
      grossWeight: gold.gross_weight ?? "N/A",
      stoneWeight: gold.stone_weight ?? "N/A",
      netWeight: gold.net_weight ?? "N/A",
      ratePerGram: formatCurrency(gold.rate_per_gram),
      marketValue: formatCurrency(gold.market_value),
      appraisedValue: formatCurrency(gold.appraised_value),
      loanValue: formatCurrency(gold.loan_value),
      conditions: gold.conditions || "N/A",
      hallmarkNo: gold.hallmark_no || "N/A",
      receiptNo: gold.receipt_no || "N/A",
      remarks: gold.remarks || "N/A",
      status: gold.status || "N/A",
      pictures: gold.pictures_url || [],
    })),
  };
};
