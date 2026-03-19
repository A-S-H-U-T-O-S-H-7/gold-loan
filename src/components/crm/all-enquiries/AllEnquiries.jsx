"use client";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, RefreshCw, User } from "lucide-react";
import EnquiriesTable from "./EnquiriesTable";
import AdvancedSearchBar from "../AdvanceSearchBar";
import DateFilter from "../DateFilter";
import { enquiryAPI, formatEnquiryForUI } from "@/lib/services/AllEnquiriesServices";
import { useThemeStore } from "@/lib/store/useThemeStore";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { exportToExcel } from "@/utils/exportutils";
import Link from "next/link";

const AllEnquiries = () => {
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  
  // File loading states
  const [fileLoading, setFileLoading] = useState(false);
  const [loadingFileName, setLoadingFileName] = useState('');
  
  // Advanced Search States
  const [searchField, setSearchField] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Date Filter States
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sourceFilter, setSourceFilter] = useState("all");

  // Data states
  const [enquiries, setEnquiries] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pageSizeOptions] = useState([10, 20, 50, 100, 150, 200]);

const handlePageSizeChange = (newSize) => {
  setItemsPerPage(newSize);
  setCurrentPage(1);
};

  // Search Options
  const SearchOptions = [
    { value: 'crnno', label: 'CRN No' },
    { value: 'fname', label: 'Name' },
    { value: 'phone', label: 'Phone Number' },
    { value: 'city', label: 'City' },
    { value: 'state', label: 'State' },
  ];

  // Build API parameters
  const buildApiParams = () => {
    const params = {
      per_page: itemsPerPage,
      page: currentPage,
    };

    // Add search parameters
    if (searchField && searchTerm.trim()) {
      params.search_by = searchField;
      params.search_value = searchTerm.trim();
    }

    // Add status filter
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }

    // Add date filters
    if (dateRange.start) {
      params.from_date = dateRange.start;
    }
    if (dateRange.end) {
      params.to_date = dateRange.end;
    }

    // Add source filter
    if (sourceFilter !== "all") {
      params.source_by = sourceFilter;
    }

    return params;
  };

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = buildApiParams();
      const response = await enquiryAPI.getAllEnquiries(params);
      
      if (response.success) {
        const formattedEnquiries = response.data.map(formatEnquiryForUI);
        setEnquiries(formattedEnquiries);
        setTotalCount(response.pagination?.total || response.data.length);
        setTotalPages(response.pagination?.total_pages || 1);
      } else {
        setError(response.message || "Failed to fetch enquiries");
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err);
      setError("Failed to fetch enquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  // Load data on component mount and when filters change
  useEffect(() => {
    fetchEnquiries();
  }, [currentPage, statusFilter, sourceFilter, itemsPerPage]);

  // Handle search and date filter changes
  useEffect(() => {
    if (currentPage === 1) {
      fetchEnquiries();
    } else {
      setCurrentPage(1);
    }
  }, [searchField, searchTerm, dateRange, itemsPerPage]);

  // Handle Advanced Search
  const handleAdvancedSearch = ({ field, term }) => {
    if (!field || !term.trim()) {
      // Clear search
      setSearchField("");
      setSearchTerm("");
      return;
    }
    
    setSearchField(field);
    setSearchTerm(term.trim());
    setCurrentPage(1);
  };

  // Handle Date Filter
  const handleDateFilter = (filters) => {
    setDateRange(filters.dateRange || { start: "", end: "" });
    setSourceFilter(filters.source || "all");
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchField("");
    setSearchTerm("");
    setDateRange({ start: "", end: "" });
    setSourceFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  

  // Format enquiries for display
  const filteredEnquiries = enquiries.map((enquiry, index) => ({
    ...enquiry,
    srNo: (currentPage - 1) * itemsPerPage + index + 1 
  }));

  // Export to Excel
  const handleExport = async (type) => {
  if (type === 'excel') {
    const result = await Swal.fire({
      title: 'Export Enquiries?',
      text: 'This will export all enquiries with current filters.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Export!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    });

    if (!result.isConfirmed) return;

    try {
      setExporting(true);
      
      // Build export params with same filters but without pagination
      const exportParams = { ...buildApiParams() };
      delete exportParams.per_page;
      delete exportParams.page;
      
      const response = await enquiryAPI.exportEnquiries(exportParams);
      
      if (response.success) {
        const headers = [
          'CRN No', 'Account ID', 'Name', 'Date of Birth', 'Gender', 
          'Phone', 'Email', 'City', 'State', 'Company Name', 
          'Net Salary', 'Applied Amount', 'Account No', 'IFSC Code', 
          'ROI', 'Tenure (Days)', 'Approval Note', 'Remark', 'Created Date', 'Enquiry Type'
        ];

        const dataRows = response.data.map(enquiry => [
          enquiry.crnno,
          enquiry.accountId,
          enquiry.name,
          enquiry.dob,
          enquiry.gender,
          enquiry.phone,
          enquiry.email || 'N/A',
          enquiry.city,
          enquiry.state,
          enquiry.company_name,
          enquiry.net_salary,
          enquiry.applied_amount,
          enquiry.account_no || 'N/A',
          enquiry.ifsc_code || 'N/A',
          `${(parseFloat(enquiry.roi) * 100).toFixed(2)}%`,
          enquiry.tenure,
          enquiry.approval_note,
          enquiry.remark || 'N/A',
          new Date(enquiry.created_at).toLocaleDateString('en-GB'),
          enquiry.enquiry_type || 'N/A'
        ]);

        const exportData = [headers, ...dataRows];
        exportToExcel(exportData, 'all-enquiries');
        
        toast.success('Enquiries exported successfully!');
        
      } else {
        throw new Error(response.message || "Export failed");
      }
    } catch (err) {
      console.error("Export error:", err);
      await Swal.fire({
        title: 'Export Failed!',
        text: 'Failed to export data. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        background: isDark ? '#1f2937' : '#ffffff',
        color: isDark ? '#f9fafb' : '#111827',
      });
    } finally {
      setExporting(false);
    }
  }
};

  

 

  if (loading && enquiries.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? "bg-gray-900" : "bg-crm-accent-soft/60"
      }`}>
        <div className="text-center">
          <RefreshCw className={`w-8 h-8 animate-spin mx-auto mb-4 ${
            isDark ? "text-crm-primary-strong" : "text-crm-primary"
          }`} />
          <p className={`text-lg font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}>
            Loading enquiries...
          </p>
        </div>
      </div>
    );
  }

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
                className={`p-2.5 sm:p-3 cursor-pointer rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                  isDark
                    ? "hover:bg-gray-800 bg-gray-800/50 border border-crm-border"
                    : "hover:bg-crm-accent-soft bg-crm-accent-soft border border-crm-border"
                }`}
              >
                <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
                  isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                }`} />
              </button>
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r truncate ${
                isDark ? "from-crm-gradient-from to-crm-gradient-to" : "from-crm-gradient-from to-crm-gradient-to"
              } bg-clip-text text-transparent`}>
                All Enquiries ({totalCount})
              </h1>
            </div>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => fetchEnquiries()}
                disabled={loading}
                className={`px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">Refresh</span>
              </button>
              
              <button
                onClick={() => handleExport('excel')}
                disabled={exporting}
                className={`px-3 sm:px-4 py-2 cursor-pointer rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 flex-1 sm:flex-initial ${
                  isDark
                    ? "bg-crm-primary hover:bg-crm-primary-strong text-white"
                    : "bg-crm-primary hover:bg-crm-primary-strong text-white"
                } ${exporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <Download className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${exporting ? 'animate-spin' : ''}`} />
                <span className="text-xs sm:text-sm">{exporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-red-900/20 border-red-700 text-red-300" : "bg-red-100 border-red-400 text-red-700"
            }`}>
              <div className="flex justify-between items-center">
                <span>{error}</span>
                <button 
                  onClick={() => setError(null)}
                  className={`ml-2 ${isDark ? "text-red-400 hover:text-red-300" : "text-red-800 hover:text-red-900"}`}
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Date Filter */}
          <DateFilter 
            isDark={isDark} 
            onFilterChange={handleDateFilter}
            dateField="enquiry_date"
            showSourceFilter={true}
            buttonLabels={{
              apply: "Apply",
              clear: "Clear"
            }}
          />

          {/* Search and Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <AdvancedSearchBar 
                searchOptions={SearchOptions}
                onSearch={handleAdvancedSearch}
                isDark={isDark}
                placeholder="Search enquiries..."
                buttonText="Search"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 font-medium ${
                isDark
                  ? "bg-gray-800 border-crm-border text-white hover:border-crm-primary focus:border-crm-primary-strong"
                  : "bg-white border-crm-border text-gray-900 hover:border-crm-primary focus:border-crm-primary"
              } focus:ring-4 focus:ring-crm-ring focus:outline-none`}
            >
              <option value="all">All Status</option>
              <option value="1">Pending</option>
              <option value="2">Completed</option>
              <option value="3">Rejected</option>
              <option value="4">Follow Up</option>
              <option value="5">Processing</option>
            </select>

<Link
  href="/crm/user-kyc/new"
  className="text-center text-lg flex items-center justify-center font-bold rounded-2xl border border-crm-border p-2 bg-linear-to-br from-crm-gradient-from to-crm-gradient-to hover:brightness-110 transition-all duration-200 cursor-pointer text-white"
>
  <User className="w-5 h-5 mr-2" />
  Create New User
</Link>          </div>

          {/* Filter Summary */}
          {(searchTerm || dateRange.start || dateRange.end || sourceFilter !== "all" || statusFilter !== "all") && (
            <div className={`mb-4 p-4 rounded-lg border ${
              isDark ? "bg-gray-800/50 border-crm-border" : "bg-crm-accent-soft/70 border-crm-border"
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-crm-primary-strong" : "text-crm-primary"
                  }`}>
                    Active Filters:
                  </span>
                  {searchTerm && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
                    }`}>
                      {SearchOptions.find(opt => opt.value === searchField)?.label}: {searchTerm}
                    </span>
                  )}
                  {dateRange.start && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
                    }`}>
                      From: {new Date(dateRange.start).toLocaleDateString('en-GB')}
                    </span>
                  )}
                  {dateRange.end && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
                    }`}>
                      To: {new Date(dateRange.end).toLocaleDateString('en-GB')}
                    </span>
                  )}
                  {sourceFilter !== "all" && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
                    }`}>
                      Source: {sourceFilter}
                    </span>
                  )}
                  {statusFilter !== "all" && (
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      isDark ? "bg-crm-primary-soft text-crm-primary-strong" : "bg-crm-primary-soft text-crm-primary-strong"
                    }`}>
                      Status: {statusFilter}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}>
                    Showing {filteredEnquiries.length} of {totalCount}
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className={`text-sm px-4 py-2 rounded-lg transition-colors duration-200 ${
                      isDark 
                        ? "bg-gray-700 hover:bg-gray-600 text-gray-300" 
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          )}

          
        </div>

        {/* Table */}
        <EnquiriesTable
          paginatedEnquiries={filteredEnquiries}
          filteredEnquiries={filteredEnquiries}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          isDark={isDark}
          onPageChange={setCurrentPage}
          onPageSizeChange={handlePageSizeChange} 
          pageSizeOptions={pageSizeOptions}
          loading={loading}
          fileLoading={fileLoading}
          loadingFileName={loadingFileName}
        />
      </div>
    </div>
  );
};

export default AllEnquiries;
