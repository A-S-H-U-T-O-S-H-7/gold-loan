'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Download, RefreshCw, UserPlus, Shield, Filter, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { toast } from 'react-hot-toast';
import AdminForm from './AdminForm';
import AdminTable from './AdminTable';
import PermissionsModal from './PermissionsModal';
import { adminService, formatAdminForUI } from '@/lib/services/AdminServices';
import Pagination from '../Pagination';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

const ManageAdminPage = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  
  // Create a ref for the form section to scroll to
  const formSectionRef = useRef(null);
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Page size states
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageSizeOptions] = useState([10, 20, 50, 100, 150, 200]);
  
  // Permissions Modal
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedAdminForPermissions, setSelectedAdminForPermissions] = useState(null);
  const [selectedAdminName, setSelectedAdminName] = useState('');
  
  const [admins, setAdmins] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 0
  });

  // Handle page size change
  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

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

  const fetchAdmins = useCallback(async (page = 1, search = "", type = filterType, status = filterStatus) => {
    try {
      setIsLoading(true);
      const response = await adminService.getAdmins({
        page,
        per_page: itemsPerPage,
        search: search.trim()
      });

      if (response.success) {
        let formattedAdmins = response.data.map(formatAdminForUI);
        
        if (type !== 'all') {
          formattedAdmins = formattedAdmins.filter(admin => admin.type === type);
        }
        
        if (status !== 'all') {
          const statusValue = status === '1';
          formattedAdmins = formattedAdmins.filter(admin => 
            admin.isActive === statusValue || admin.isActive?.toString() === status
          );
        }
        
        setAdmins(formattedAdmins);
        setPagination(response.pagination);
        setCurrentPage(response.pagination.current_page);
      } else {
        throw new Error(response.message || "Failed to fetch admins");
      }
    } catch (err) {
      console.error("Error fetching admins:", err);
      toast.error(err.message || "Failed to load admins");
      setAdmins([]);
      setPagination({
        total: 0,
        current_page: 1,
        per_page: itemsPerPage,
        total_pages: 0
      });
    } finally {
      setIsLoading(false);
    }
  }, [filterType, filterStatus, itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAdmins(1, searchTerm, filterType, filterStatus);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterType, filterStatus, fetchAdmins]);

  useEffect(() => {
    fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
  }, [currentPage, fetchAdmins]);

  const handleSubmitAdmin = async (formData) => {
    try {
      const { user: currentAdmin } = useAdminAuthStore.getState();
      
      if (currentAdmin?.id) {
        formData.append('admin_id', currentAdmin.id);
      }
      
      if (!isEditMode && currentAdmin?.id) {
        formData.append('created_by', currentAdmin.id);
      }
      
      if (isEditMode && selectedAdmin) {
        formData.append('id', selectedAdmin.id);
      }
      
      if (isEditMode && selectedAdmin) {
        await adminService.updateAdmin(selectedAdmin.id, formData);
      } else {
        await adminService.addAdmin(formData);
      }
      
      await fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
      resetForm();
      
    } catch (err) {
      throw err;
    }
  };

  const handleEdit = async (admin) => {
    try {
      const response = await adminService.getAdminById(admin.id);
      if (response.success) {
        const adminData = formatAdminForUI(response.data);
        setSelectedAdmin(adminData);
        setIsEditMode(true);
        setIsFormExpanded(true);
        // Scroll to form after setting state
        scrollToForm();
      }
    } catch (err) {
      console.error("Error fetching admin:", err);
      toast.error("Failed to load admin details");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await adminService.toggleStatus(id);
      if (response.success) {
        await fetchAdmins(currentPage, searchTerm, filterType, filterStatus);
        toast.success('Status updated successfully!');
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      toast.error(err.message || "Failed to update admin status");
    }
  };

  const handleOpenPermissions = (adminId, adminName) => {
    setSelectedAdminForPermissions(adminId);
    setSelectedAdminName(adminName);
    setShowPermissionsModal(true);
  };

  const handleSavePermissions = async (adminId, permissions) => {
    try {
      const response = await adminService.updatePermissions(adminId, permissions);
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || "Failed to update permissions");
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to save permissions";
      toast.error(errorMessage);
      throw err;
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetForm = () => {
    setIsFormExpanded(false);
    setIsEditMode(false);
    setSelectedAdmin(null);
  };

  const toggleForm = () => {
    if (isFormExpanded && isEditMode) {
      resetForm();
    } else {
      setIsFormExpanded(!isFormExpanded);
    }
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
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
          {itemsPerPage} per page
        </span>
        {searchTerm && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            isDark ? "bg-blue-900/30 text-blue-300" : "bg-blue-100 text-blue-700"
          }`}>
            Search: "{searchTerm}"
          </span>
        )}
        {filterType !== 'all' && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            isDark ? "bg-purple-900/30 text-purple-300" : "bg-purple-100 text-purple-700"
          }`}>
            Type: {filterType}
          </span>
        )}
        {filterStatus !== 'all' && (
          <span className={`px-3 py-1 rounded-full text-sm ${
            filterStatus === '1' 
              ? isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-700"
              : isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-700"
          }`}>
            Status: {filterStatus === '1' ? 'Active' : 'Inactive'}
          </span>
        )}
        {pagination.total > 0 && (
          <span className={`ml-auto text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Total Records: <span className="font-bold">{pagination.total}</span>
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-crm-accent-soft/60"
    }`}>
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className={`p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-crm-border"
                    : "hover:bg-crm-accent-soft bg-crm-accent-soft border border-crm-border"
                }`}
              >
                <ArrowLeft className={`w-5 h-5 ${
                  isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                }`} />
              </button>
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  isDark ? "bg-crm-primary-soft" : "bg-crm-primary-soft"
                }`}>
                  <Shield className={`w-6 h-6 ${
                    isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                  }`} />
                </div>
                <div>
                  <h1 className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${
                    isDark ? "from-crm-gradient-from to-crm-gradient-to" : "from-crm-gradient-from to-crm-gradient-to"
                  } bg-clip-text text-transparent`}>
                    Manage Admins
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Total: {pagination.total} admins
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  resetForm();
                  setIsFormExpanded(true);
                  scrollToForm(); // Scroll when adding new admin
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-crm-primary hover:bg-crm-primary-strong text-white"
                    : "bg-crm-primary hover:bg-crm-primary-strong text-white"
                }`}
              >
                <UserPlus size={16} />
                <span>Add Admin</span>
              </button>
              
              <button
                onClick={() => fetchAdmins(currentPage, searchTerm, filterType, filterStatus)}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search by name, username, email or phone..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-800 border-crm-border text-white placeholder-gray-400 focus:border-crm-primary'
                        : 'bg-white border-crm-border text-gray-900 placeholder-gray-500 focus:border-crm-primary'
                    } focus:ring-2 focus:ring-crm-ring focus:outline-none`}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
                      isDark
                      ? 'bg-gray-800 hover:bg-gray-700 border border-crm-border text-gray-300'
                      : 'bg-white hover:bg-gray-50 border border-crm-border text-gray-700'
                  }`}
                >
                  <Filter size={16} />
                  <span>Filters</span>
                </button>
              </div>
            </div>
            
            {showAdvancedFilters && (
              <div className={`mt-4 p-4 rounded-xl border ${
                isDark
                  ? 'bg-gray-800 border-crm-border'
                  : 'bg-white border-crm-border'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Admin Type
                    </label>
                    <select
                      value={filterType}
                      onChange={(e) => {
                        setFilterType(e.target.value);
                        setCurrentPage(1);
                      }}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                          ? 'bg-gray-700 border-crm-border text-white'
                          : 'bg-white border-crm-border text-gray-900'
                      }`}
                    >
                      <option value="all">All Types</option>
                      <option value="user">User</option>
                      <option value="verifier">Verifier</option>
                      <option value="account">Account</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Super Admin</option>
                      <option value="collection">Collection</option>
                      <option value="agency">Agency</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => {
                        setFilterStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          isDark
                          ? 'bg-gray-700 border-crm-border text-white'
                          : 'bg-white border-crm-border text-gray-900'
                      }`}
                    >
                      <option value="all">All Status</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={handleClearFilters}
                      className={`px-4 py-2 rounded-lg ${
                        isDark
                          ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Filter Summary */}
          {renderFilterSummary()}
        </div>

        {/* Admin Form - Add ref here */}
        <div ref={formSectionRef} className="mb-8">
          <AdminForm
            isDark={isDark}
            onSubmit={handleSubmitAdmin}
            initialData={selectedAdmin}
            isEditMode={isEditMode}
            isExpanded={isFormExpanded}
            onToggleExpand={toggleForm}
          />
        </div>

        {/* Admin Table */}
        <div className="mb-6">
          <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
            isDark
              ? "bg-gray-800 border-crm-border"
              : "bg-white border-crm-border"
          }`}>
            <AdminTable
              admins={admins}
              isDark={isDark}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
              onOpenPermissions={handleOpenPermissions}
              isLoading={isLoading}
            />
            
            {!isLoading && admins.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.current_page}
                  totalPages={pagination.total_pages}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  totalItems={pagination.total}
                  itemsPerPage={itemsPerPage}
                  pageSizeOptions={pageSizeOptions}
                />
              </div>
            )}
          </div>
        </div>

        <PermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedAdminForPermissions(null);
            setSelectedAdminName('');
          }}
          adminId={selectedAdminForPermissions}
          adminName={selectedAdminName}
          isDark={isDark}
          onSavePermissions={handleSavePermissions}
        />
      </div>
    </div>
  );
};

export default ManageAdminPage;

