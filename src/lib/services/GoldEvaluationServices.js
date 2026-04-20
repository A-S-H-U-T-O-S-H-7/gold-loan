"use client";
import api from "@/utils/axiosInsatnce";

export const goldEvaluationAPI = {
  // Get customer details for evaluation
  getCustomerDetails: async (applicationId) => {
    try {
      const response = await api.get(`/crm/application/edit/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get existing evaluation for an application
  getEvaluation: async (applicationId) => {
    try {
      const response = await api.get(`/crm/gold/evaluation/${applicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new gold evaluation
  createEvaluation: async (data) => {
    try {
      const response = await api.post("/crm/gold/evaluation", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update existing gold evaluation
  updateEvaluation: async (evaluationId, data) => {
    try {
      const response = await api.put(`/crm/gold/evaluation/${evaluationId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Save evaluation (create or update)
  saveEvaluation: async (applicationId, data) => {
    try {
      // First check if evaluation exists
      try {
        const existing = await goldEvaluationAPI.getEvaluation(applicationId);
        if (existing.success && existing.data) {
          // Update existing evaluation
          return await goldEvaluationAPI.updateEvaluation(existing.data.id, data);
        }
      } catch (error) {
        // Evaluation doesn't exist, create new
      }
      // Create new evaluation
      return await goldEvaluationAPI.createEvaluation(data);
    } catch (error) {
      throw error;
    }
  },

  // Get current gold rate
  getGoldRate: async () => {
    try {
      const response = await api.get("/crm/gold/rate");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update gold rate (admin only)
  updateGoldRate: async (rate, effectiveDate = null) => {
    try {
      const data = {
        rate: rate,
        effective_date: effectiveDate || new Date().toISOString().split('T')[0]
      };
      const response = await api.put("/crm/gold/rate", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Upload gold item image
  uploadGoldImage: async (itemId, file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.post(`/crm/gold/item/${itemId}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete gold item image
  deleteGoldImage: async (itemId) => {
    try {
      const response = await api.delete(`/crm/gold/item/${itemId}/image`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get LTV configuration
  getLTVConfig: async () => {
    try {
      const response = await api.get("/crm/gold/ltv-config");
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update LTV configuration (admin only)
  updateLTVConfig: async (percentage, minAmount = null, maxAmount = null) => {
    try {
      const data = {
        ltv_percentage: percentage,
        min_loan_amount: minAmount,
        max_loan_amount: maxAmount
      };
      const response = await api.put("/crm/gold/ltv-config", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Calculate loan amount based on gold value
  calculateLoanAmount: async (netWeight, goldRate, ltvPercentage) => {
    try {
      const response = await api.post("/crm/gold/calculate-loan", {
        net_weight: netWeight,
        gold_rate: goldRate,
        ltv_percentage: ltvPercentage
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Submit evaluation for approval
  submitForApproval: async (evaluationId) => {
    try {
      const response = await api.post(`/crm/gold/evaluation/${evaluationId}/submit`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Approve evaluation
  approveEvaluation: async (evaluationId, remarks = "") => {
    try {
      const response = await api.post(`/crm/gold/evaluation/${evaluationId}/approve`, { remarks });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reject evaluation
  rejectEvaluation: async (evaluationId, remarks = "") => {
    try {
      const response = await api.post(`/crm/gold/evaluation/${evaluationId}/reject`, { remarks });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get evaluation summary report
  getEvaluationReport: async (evaluationId) => {
    try {
      const response = await api.get(`/crm/gold/evaluation/${evaluationId}/report`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Export evaluation data
  exportEvaluation: async (evaluationId, format = 'pdf') => {
    try {
      const response = await api.get(`/crm/gold/evaluation/${evaluationId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Format gold evaluation data for UI
export const formatGoldEvaluationForUI = (data) => {
  if (!data) return null;

  // Format gold items
  const formatGoldItems = (items) => {
    if (!items || !Array.isArray(items)) return [];
    
    return items.map(item => ({
      id: item.id,
      itemType: item.item_type || item.itemType,
      purity: item.purity,
      grossWeight: parseFloat(item.gross_weight || item.grossWeight || 0),
      netWeight: parseFloat(item.net_weight || item.netWeight || 0),
      stoneWeight: parseFloat(item.stone_weight || item.stoneWeight || 0),
      description: item.description || '',
      imageUrl: item.image_url || item.imageUrl || null,
      imagePreview: item.image_preview || item.imagePreview || null,
      createdAt: item.created_at || item.createdAt,
      updatedAt: item.updated_at || item.updatedAt
    }));
  };

  // Calculate totals
  const calculateTotals = (items) => {
    let totalGrossWeight = 0;
    let totalNetWeight = 0;
    let totalStoneWeight = 0;
    
    items.forEach(item => {
      totalGrossWeight += item.grossWeight;
      totalNetWeight += item.netWeight;
      totalStoneWeight += item.stoneWeight;
    });
    
    return {
      totalGrossWeight: totalGrossWeight.toFixed(2),
      totalNetWeight: totalNetWeight.toFixed(2),
      totalStoneWeight: totalStoneWeight.toFixed(2),
      itemCount: items.length
    };
  };

  const goldItems = formatGoldItems(data.gold_items || data.golds);
  const totals = calculateTotals(goldItems);
  
  // Calculate eligible amount
  const goldRate = parseFloat(data.gold_rate || data.goldRate || 0);
  const ltvPercentage = parseFloat(data.ltv_percentage || data.ltvPercentage || 75);
  const eligibleAmount = (totals.totalNetWeight * goldRate * ltvPercentage) / 100;

  return {
    id: data.id,
    applicationId: data.application_id || data.applicationId,
    userId: data.user_id || data.userId,
    crnNo: data.crnno || data.crnNo,
    
    // Gold items
    goldItems: goldItems,
    itemCount: totals.itemCount,
    
    // Weights
    totalGrossWeight: totals.totalGrossWeight,
    totalNetWeight: totals.totalNetWeight,
    totalStoneWeight: totals.totalStoneWeight,
    
    // Valuation
    goldRate: goldRate,
    ltvPercentage: ltvPercentage,
    eligibleAmount: eligibleAmount.toFixed(2),
    
    // Status
    status: data.status || 'draft',
    statusName: getEvaluationStatusName(data.status),
    
    // Appraiser details
    appraiserId: data.appraiser_id || data.appraiserId,
    appraiserName: data.appraiser_name || data.appraiserName,
    appraiserRemarks: data.appraiser_remarks || data.appraiserRemarks,
    
    // Approval details
    approvedBy: data.approved_by || data.approvedBy,
    approvedAt: data.approved_at || data.approvedAt,
    approvalRemarks: data.approval_remarks || data.approvalRemarks,
    
    // Timestamps
    evaluatedAt: data.evaluated_at || data.evaluatedAt,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt
  };
};

// Format customer details for UI
export const formatCustomerForEvaluation = (customerData) => {
  if (!customerData) return null;
  
  const data = customerData.data || customerData;
  
  return {
    id: data.application_id || data.id,
    userId: data.user_id || data.userId,
    crnNo: data.crnno || data.crnNo,
    fullName: data.fullname || data.fullName || data.name,
    firstName: data.fname || data.firstName,
    lastName: data.lname || data.lastName,
    fatherName: data.fathername || data.fatherName,
    dob: data.dob,
    gender: data.gender,
    mobile: data.phone || data.mobile,
    email: data.email || 'N/A',
    
    // Current Address
    currentAddress: {
      houseNo: data.current_house_no || data.currentHouseNo,
      address: data.current_address || data.currentAddress,
      city: data.current_city || data.currentCity,
      state: data.current_state || data.currentState,
      pincode: data.current_pincode || data.currentPincode
    },
    
    // Permanent Address
    permanentAddress: {
      houseNo: data.house_no || data.houseNo,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode
    },
    
    // KYC Status
    aadharNumber: data.aadhar_no || data.aadharNumber,
    panNumber: data.pan_no || data.panNumber,
    kycStatus: data.kyc_status || data.kycStatus,
    
    // Loan Details
    appliedAmount: data.applied_amount || data.appliedAmount,
    loanStatus: data.loan_status || data.loanStatus,
    
    // Documents
    hasPhoto: !!data.selfie,
    hasPanCard: !!data.pan_proof,
    hasAddressProof: !!data.address_proof,
    hasIdProof: !!data.aadhar_proof
  };
};

// Get evaluation status name
export const getEvaluationStatusName = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'pending': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'evaluated': 'Evaluated',
    'completed': 'Completed'
  };
  return statusMap[status] || status || 'Unknown';
};

// Get evaluation status ID
export const getEvaluationStatusId = (statusName) => {
  const statusMap = {
    'Draft': 'draft',
    'Pending Approval': 'pending',
    'Approved': 'approved',
    'Rejected': 'rejected',
    'Evaluated': 'evaluated',
    'Completed': 'completed'
  };
  return statusMap[statusName] || 'draft';
};

// Gold evaluation service with common operations
export const goldEvaluationService = {
  // Get customer details
  getCustomerDetails: async (applicationId) => {
    try {
      const response = await goldEvaluationAPI.getCustomerDetails(applicationId);
      return {
        success: response.success,
        message: response.message,
        data: formatCustomerForEvaluation(response)
      };
    } catch (error) {
      throw error;
    }
  },

  // Get evaluation
  getEvaluation: async (applicationId) => {
    try {
      const response = await goldEvaluationAPI.getEvaluation(applicationId);
      return {
        success: response.success,
        message: response.message,
        data: formatGoldEvaluationForUI(response.data)
      };
    } catch (error) {
      throw error;
    }
  },

  // Save evaluation
  saveEvaluation: async (applicationId, evaluationData) => {
    try {
      const payload = {
        application_id: applicationId,
        gold_items: evaluationData.gold_items,
        gold_rate: evaluationData.gold_rate,
        ltv_percentage: evaluationData.ltv_percentage,
        total_gross_weight: evaluationData.total_gross_weight,
        total_net_weight: evaluationData.total_net_weight,
        total_stone_weight: evaluationData.total_stone_weight,
        eligible_amount: evaluationData.eligible_amount,
        appraiser_remarks: evaluationData.appraiser_remarks,
        status: evaluationData.status || 'draft'
      };
      
      const response = await goldEvaluationAPI.saveEvaluation(applicationId, payload);
      return {
        success: response.success,
        message: response.message,
        data: formatGoldEvaluationForUI(response.data)
      };
    } catch (error) {
      throw error;
    }
  },

  // Get gold rate
  getGoldRate: async () => {
    try {
      const response = await goldEvaluationAPI.getGoldRate();
      return {
        success: response.success,
        rate: response.rate || response.data?.rate || 0,
        effectiveDate: response.effective_date || response.data?.effective_date,
        message: response.message
      };
    } catch (error) {
      throw error;
    }
  },

  // Calculate loan amount
  calculateLoanAmount: async (netWeight, goldRate, ltvPercentage) => {
    try {
      const response = await goldEvaluationAPI.calculateLoanAmount(netWeight, goldRate, ltvPercentage);
      return {
        success: response.success,
        eligibleAmount: response.eligible_amount || response.data?.eligible_amount || 0,
        message: response.message
      };
    } catch (error) {
      // Fallback calculation if API fails
      const eligibleAmount = (netWeight * goldRate * ltvPercentage) / 100;
      return {
        success: true,
        eligibleAmount: eligibleAmount.toFixed(2),
        message: 'Calculated locally'
      };
    }
  },

  // Upload gold item image
  uploadImage: async (itemId, file) => {
    try {
      const response = await goldEvaluationAPI.uploadGoldImage(itemId, file);
      return {
        success: response.success,
        imageUrl: response.image_url || response.data?.image_url,
        message: response.message
      };
    } catch (error) {
      throw error;
    }
  },

  // Submit for approval
  submitForApproval: async (evaluationId) => {
    try {
      const response = await goldEvaluationAPI.submitForApproval(evaluationId);
      return {
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  },

  // Approve evaluation
  approve: async (evaluationId, remarks = "") => {
    try {
      const response = await goldEvaluationAPI.approveEvaluation(evaluationId, remarks);
      return {
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  },

  // Reject evaluation
  reject: async (evaluationId, remarks = "") => {
    try {
      const response = await goldEvaluationAPI.rejectEvaluation(evaluationId, remarks);
      return {
        success: response.success,
        message: response.message,
        data: response.data
      };
    } catch (error) {
      throw error;
    }
  }
};

export default goldEvaluationService;