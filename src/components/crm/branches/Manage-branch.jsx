'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  RefreshCw, 
  Plus,
  Building2,
  Search,
  X
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import BranchForm from './BranchForm';
import BranchTable from './BranchTable';
import { branchService, formatBranchForUI } from '@/lib/services/BranchServices';

const ManageBranchPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Create ref for form section
  const formSectionRef = useRef(null);
  
  // State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  const [branches, setBranches] = useState([]);

  const editId = searchParams.get('edit');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Scroll to form function
  const scrollToForm = () => {
    if (formSectionRef.current) {
      setTimeout(() => {
        formSectionRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  // Fetch branches
  const fetchBranches = async (search = "") => {
    try {
      setIsLoading(true);
      const response = await branchService.getBranches({
        search
      });

      if (response.status === "success") {
        const formattedBranches = (response.data || []).map(formatBranchForUI);
        setBranches(formattedBranches);

      } else {
        throw new Error(response.message || "Failed to fetch branches");
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      toast.error(err.message || "Failed to load branches");
      setBranches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit mode from URL
  useEffect(() => {
    if (editId) {
      handleEdit(editId);
    }
  }, [editId]);

  // Fetch data on mount   and when search changes
  useEffect(() => {
    fetchBranches(debouncedSearch);
  }, [debouncedSearch]);

  // Handle add/update branch
  const handleSubmitBranch = async (values) => {
    try {
      if (isEditMode && selectedBranch) {
        await branchService.updateBranch(selectedBranch.id, values);
      } else {
        await branchService.addBranch(values);
      }
      
      // Refresh the list
      await fetchBranches(debouncedSearch);
      
      // Reset form
      setIsFormExpanded(false);
      setIsEditMode(false);
      setSelectedBranch(null);
      
      // Clear edit param from URL
      if (editId) {
        router.replace('/crm/branch/manage');
      }
    } catch (err) {
      throw err;
    }
  };

  // Handle edit
  const handleEdit = async (branchOrId) => {
    try {
      let branchData;
      
      if (typeof branchOrId === 'string' || typeof branchOrId === 'number') {
        const response = await branchService.getBranchById(branchOrId);
        if (response.status === "success") {
          branchData = response.data;
        } else {
          throw new Error("Failed to fetch branch details");
        }
      } else {
        branchData = {
          branch_code: branchOrId.branchCode,
          branch_name: branchOrId.branchName,
          company_name: branchOrId.companyName,
          manager_name: branchOrId.managerName,
          email: branchOrId.email,
          phone: branchOrId.phone,
          alternate_phone: branchOrId.alternatePhone || '',
          address: branchOrId.address,
          city: branchOrId.city,
          state: branchOrId.state,
          pincode: branchOrId.pincode,
          status: branchOrId.isActive ? 1 : 0
        };
      }

      setSelectedBranch({
        id: typeof branchOrId === 'object' ? branchOrId.id : branchOrId,
        ...branchData
      });
      setIsEditMode(true);
      setIsFormExpanded(true);
      scrollToForm();
    } catch (err) {
      console.error("Error fetching branch:", err);
      toast.error("Failed to load branch details");
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id) => {
    try {
      await branchService.toggleStatus(id);
      await fetchBranches(debouncedSearch);
      // toast.success('Status updated successfully!');
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    try {
      await branchService.deleteBranch(id);
      await fetchBranches(debouncedSearch);
      toast.success('Branch deleted successfully!');
    } catch (err) {
      toast.error(err.message || "Failed to delete branch");
    }
  };

  // Toggle form expansion
  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (isFormExpanded && isEditMode) {
      setIsEditMode(false);
      setSelectedBranch(null);
      if (editId) {
        router.replace('/crm/branch/manage');
      }
    }
  };

  // Cancel edit
  const cancelEdit = () => {
    setIsEditMode(false);
    setSelectedBranch(null);
    setIsFormExpanded(false);
    if (editId) {
      router.replace('/crm/branch/manage');
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm("");
  };

  // Filter summary component
  const renderFilterSummary = () => {
    return (
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Showing:
        </span>
        <span className={`px-3 py-1 rounded-full text-sm ${
          isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
        }`}>
          All branches
        </span>
        {searchTerm && (
          <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
            isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
          }`}>
            Search: "{searchTerm}"
            <button onClick={clearSearch} className="ml-1 hover:opacity-75">
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
        <span className={`ml-auto text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Total Branches: <span className="font-bold">{branches.length}</span>
        </span>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-crm-accent-soft/60"
    }`}>
      <div className="p-0 md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => router.back()}
                className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-crm-border"
                    : "hover:bg-crm-accent-soft bg-crm-accent-soft border border-crm-border"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                }`} />
              </button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className={`p-2 sm:p-3 rounded-lg ${
                  isDark ? "bg-crm-primary-soft" : "bg-crm-primary-soft"
                }`}>
                  <Building2 className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-lg sm:text-xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                    isDark ? "from-crm-gradient-from to-crm-gradient-to" : "from-crm-gradient-from to-crm-gradient-to"
                  } bg-clip-text text-transparent`}>
                    Manage Branches
                  </h1>
                  <p className={`text-xs sm:text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total: {branches.length} branches
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  if (isEditMode) cancelEdit();
                  setIsFormExpanded(true);
                  scrollToForm();
                }}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-crm-primary hover:bg-crm-primary-strong text-white"
                    : "bg-crm-primary hover:bg-crm-primary-strong text-white"
                }`}
              >
                <Plus size={14} className="sm:size-[16px]" />
                <span className="text-xs sm:text-sm">Add Branch</span>
              </button>
              
              <button
                onClick={() => fetchBranches(debouncedSearch)}
                disabled={isLoading}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={14} className={`sm:size-[16px] ${isLoading ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`} />
            <input
              type="text"
              placeholder="Search by branch name, code, city, manager..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                isDark
                  ? 'bg-gray-800 border-crm-border text-white placeholder-gray-400 focus:border-crm-primary'
                  : 'bg-white border-crm-border text-gray-900 placeholder-gray-500 focus:border-crm-primary'
              } focus:ring-2 focus:ring-crm-ring focus:outline-none`}
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                }`}
              >
                <X className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
              </button>
            )}
          </div>

          {/* Filter Summary */}
          {renderFilterSummary()}
        </div>

        {/* Branch Form */}
        <div ref={formSectionRef} className="mb-8">
          <BranchForm
            isDark={isDark}
            onSubmit={handleSubmitBranch}
            initialData={selectedBranch}
            isEditMode={isEditMode}
            isExpanded={isFormExpanded}
            onToggleExpand={toggleForm}
          />
        </div>

        {/* Branch Table */}
        <BranchTable
          branches={branches}
          isDark={isDark}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ManageBranchPage;

