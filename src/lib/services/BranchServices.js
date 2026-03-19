import api from "@/utils/axiosInsatnce";

export const branchService = {
  // Get all branches with pagination and search
  getBranches: async (params = {}) => {
    try {
      const response = await api.get('/crm/branch/manage', {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || ''
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single branch by ID for edit
  getBranchById: async (id) => {
    try {
      const response = await api.get(`/crm/branch/edit/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Add new branch
  addBranch: async (branchData) => {
    try {
      const response = await api.post('/crm/branch/create', branchData);
      if (response.status === false) {
        throw new Error(response.message || 'Failed to add branch');
      }
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        throw {
          response: {
            data: errorData,
            status: error.response.status
          },
          message: errorData.message || 'Failed to add branch'
        };
      }
      throw error;
    }
  },

  // Update branch
  updateBranch: async (id, branchData) => {
    try {
      const response = await api.post(`/crm/branch/update/${id}`, branchData);
      if (response.status === false) {
        throw new Error(response.message || 'Failed to update branch');
      }
      return response;
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data || {};
        throw {
          response: {
            data: errorData,
            status: error.response.status
          },
          message: errorData.message || 'Failed to update branch'
        };
      }
      throw error;
    }
  },

  // Toggle branch status (active/inactive)
  toggleStatus: async (id) => {
    try {
      const response = await api.get(`/crm/branch/status/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete branch
  deleteBranch: async (id) => {
    try {
      const response = await api.get(`/crm/branch/delete/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

export const formatBranchForUI = (branch) => {
  const isEmpty = (value) => {
    return value === null || value === undefined || value === '' || value === 'N/A';
  };

  return {
    id: branch.id,
    branchCode: branch.branch_code || '',
    branchName: branch.branch_name || '',
    companyName: branch.company_name || '',
    managerName: branch.manager_name || '',
    email: branch.email || '',
    phone: branch.phone || '',
    alternatePhone: isEmpty(branch.alternate_phone) ? '' : branch.alternate_phone,
    address: branch.address || '',
    city: branch.city || '',
    state: branch.state || '',
    pincode: branch.pincode || '',
    isActive: branch.status === 1,
    status: branch.status === 1 ? 'Active' : 'Inactive',
    createdAt: branch.created_at || '',
    updatedAt: branch.updated_at || ''
  };
};