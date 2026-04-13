"use client";
import api from "@/utils/axiosInsatnce";
import { getStatusName, getStatusId } from "@/utils/applicationStatus";
import fileService from "./fileService";

export const followUpApplicationAPI = {
  // Get all follow-up applications with filters
  getFollowUpApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/followup", { params });
      return response;
    } catch (error) {
      throw error;
    } 
  },

  exportFollowUpApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/followup", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

 

  sendActivationEmail: async (applicationId) => {
    try {
      const response = await api.get(`/crm/office/email/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatFollowUpApplicationForUI = (application) => {
  const enquiryDate = application.enquiry_date ? new Date(application.enquiry_date) : null;
  
  const permanentAddress = [
    application.house_no,
    application.address,
    application.city,
    application.state,
    application.pincode
  ].filter(Boolean).join(', ') || 'N/A';
  
  const currentAddress = [
    application.current_house_no,
    application.current_address,
    application.current_city,
    application.current_state,
    application.current_pincode
  ].filter(Boolean).join(', ') || 'N/A';

  return {
    id: application.application_id,
    srNo: application.application_id,
    enquirySource: application.enquiry_type || 'N/A',
    crnNo: application.crnno,
    accountId: application.accountId,
    userId: application.user_id,
    user_id: application.user_id,


    enquiryDate: enquiryDate ? enquiryDate.toLocaleDateString('en-GB') : 'N/A',
    enquiryDateTime: application.enquiry_date, 
    updatedAt: application.updated_at,

    name: application.fullname || application.name || '',
    dob: application.dob,
    gender: application.gender,

    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    pincode: application.pincode,
    houseNo: application.house_no,
    
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,
    currentPincode: application.current_pincode,
    currentHouseNo: application.current_house_no,

    phoneNo: application.phone,
    email: application.email || 'N/A',

    goldAmount: application.gold_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

    isBlacklisted: application.blacklist === 1,
    blacklistDate: application.blacklistdate,

    hasPhoto: !!application.selfie,
    hasPanCard: !!application.pan_proof,
    hasAddressProof: !!application.address_proof,
    hasIdProof: !!application.aadhar_proof,

    photoFileName: application.selfie,
    panCardFileName: application.pan_proof,
    addressProofFileName: application.address_proof,
    idProofFileName: application.aadhar_proof,

    approvalNote: application.approval_note,
    status: getStatusName(application.loan_status),
    loanStatus: getStatusName(application.loan_status),

    verify: application.verify,
    isVerified: application.verify === 1,
    isReportChecked: application.report_check === 1,
    isFinalStage: application.verify === 1 && application.report_check === 1,
    verifyStatus: application.verify,
    reportCheckStatus: application.report_check,

    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    isRecommended: application.totl_final_report === "Recommended",
    totl_final_report: application.totl_final_report,

    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true,
  };
};

// Status update utility
export const followUpService = {
  updateStatus: async (applicationId, status, remark = "") => {
    try {
      const statusData = {
        status: getStatusId(status),
        remark: remark
      };
      const response = await followUpApplicationAPI.updateApplicationStatus(applicationId, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  blacklist: async (userId) => {
    try {
      const response = await api.put(`/crm/application/black-list/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },


  sendActivationEmail: async (applicationId) => {
    try {
      const response = await followUpApplicationAPI.sendActivationEmail(applicationId);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export { fileService };
