"use client";
import api from "@/utils/axiosInsatnce";
import fileService from "./fileService";
import { getStatusName, getStatusId } from "@/utils/applicationStatus";

export const inProgressApplicationAPI = {

  getInProgressApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/inprocess", { params });
      return response;
    } catch (error) {
      throw error;
    }
  }, 

  // Export in-progress applications
  exportInProgressApplications: async (params = {}) => {
    try {
      const response = await api.get("/crm/application/export/inprocess", { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (applicationId, statusData) => {
    try {
      const response = await api.put(`/crm/application/status/${applicationId}`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format application data for UI
export const formatInProgressApplicationForUI = (application) => {
  const enquiryDate = application.enquiry_date ? new Date(application.enquiry_date) : null;
  const updatedDate = application.updated_at ? new Date(application.updated_at) : new Date();
  
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
    loanNo: application.loan_no || `LN${application.application_id}`,
    userId: application.user_id,
    user_id: application.user_id,


    enquiryDate: enquiryDate ? enquiryDate.toLocaleDateString('en-GB') : 'N/A',
    enquiryDateTime: application.enquiry_date,
    updatedTime: updatedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),

    name: application.fullname || application.name || '',
    
    permanentAddress: permanentAddress,
    state: application.state,
    city: application.city,
    
    currentAddress: currentAddress,
    currentState: application.current_state,
    currentCity: application.current_city,

    phoneNo: application.phone,
    email: application.email || 'N/A',

    goldAmount: application.gold_amount,
    approvedAmount: application.approved_amount,
    roi: application.roi,
    tenure: application.tenure,
    loanTerm: application.loan_term === 4 ? "One Time Payment" : "Daily",

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

    hasAppraisalReport: !!application.totl_final_report,
    finalReportStatus: application.totl_final_report,
    isRecommended: application.totl_final_report === "Recommended",

    showActionButton: true,
    showAppraisalButton: true,
    showEligibilityButton: true
  };
};

// Status update utility
export const inProgressService = {
  
 updateStatus: async (applicationId, updateData) => {
    try {
      const statusData = {
        status: getStatusId(updateData.status),
        remark: updateData.remark,
        documents_received: updateData.documentsReceived,
        bank_verified: updateData.bankVerified,
        selected_bank: updateData.selectedBank
      };
      
      const response = await inProgressApplicationAPI.updateApplicationStatus(applicationId, statusData);
      
      if (response && response.success === false) {
        throw new Error(response.message || "Status update failed");
      }
      
      return response;
    } catch (error) {
      
      if (error.response?.message) {
        throw new Error(error.response.message);
      } else if (error.response?.error) {
        throw new Error(error.response.error);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error("Failed to update application status");
      }
    }
  }
};

export { fileService };
