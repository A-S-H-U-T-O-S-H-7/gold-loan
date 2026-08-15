'use client';
import { useState, useEffect, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DateFilter from '@/components/crm/ui/DateFilter';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import RejectedTableRow from '@/components/crm/rejected-applications/RejectedTableRow';
import toast from 'react-hot-toast';

export default function RejectedApplicationsPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  
  const { applications, setStatus } = useLoanStore();
  const rejectedApps = applications.filter(a => a.status === 'REJECTED');
  
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });
  const [dateFilters, setDateFilters] = useState({ dateRange: { start: '', end: '' } });

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
  ];

  // ✅ FIX: Use useMemo instead of useState + useEffect
  const filteredData = useMemo(() => {
    let data = [...rejectedApps];
    
    // Search filter
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    
    // Date filter
    if (dateFilters.dateRange.start) {
      data = data.filter(app => {
        const date = new Date(app.timeline?.createdAt);
        return date >= new Date(dateFilters.dateRange.start);
      });
    }
    if (dateFilters.dateRange.end) {
      data = data.filter(app => {
        const date = new Date(app.timeline?.createdAt);
        return date <= new Date(dateFilters.dateRange.end);
      });
    }
    
    return data;
  }, [rejectedApps, searchFilters, dateFilters]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters, dateFilters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleRestore = (id) => {
    const app = applications.find(a => a.id === id);
    const nextStatus = app?.previousStatus || 'PENDING';
    setStatus(id, nextStatus, { rejectedReason: null, rejectedStage: null });
    toast.success(`Application ${id} restored to ${nextStatus}`);
  };

  const handleView = (app) => {
    toast.info(`Viewing application: ${app.id}`);
  };

  const handleExport = async () => {
    toast.success('Export started');
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'call', label: 'Call', width: '70px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'crnNo', label: 'CRN No', width: '110px' },
    { key: 'enquiryDate', label: 'Enquiry Date', width: '140px' },
    { key: 'completeDate', label: 'Complete Date', width: '140px' },
    { key: 'rejectedDate', label: 'Rejected Date', width: '140px' },
    { key: 'name', label: 'Name', width: '160px' },
    { key: 'mobile', label: 'Mobile', width: '120px' },
    { key: 'email', label: 'Email', width: '180px' },
    { key: 'amount', label: 'Loan Amount', width: '120px' },
    { key: 'roi', label: 'ROI', width: '80px' },
    { key: 'tenure', label: 'Tenure', width: '100px' },
    { key: 'status', label: 'Status', width: '100px' },
    { key: 'reason', label: 'Reason', width: '160px' },
    { key: 'actions', label: 'Actions', width: '160px' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gold-50/30'
    }`}>
      <div className="p-2 md:p-4">
        <PageHeader
          title="Rejected Applications"
          count={totalItems}
          isDark={isDark}
          actions={
            <>
              <button
                onClick={() => setLoading(true)}
                disabled={loading}
                className={`cursor-pointer px-4 py-2 rounded-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <ExportButton
                data={filteredData}
                filename="rejected-applications"
                headers={['App ID', 'Name', 'Mobile', 'Status', 'Rejected Reason']}
                isDark={isDark}
                disabled={filteredData.length === 0}
                onExport={handleExport}
              />
            </>
          }
        />

        <DateFilter
          onFilterChange={setDateFilters}
          isDark={isDark}
        />

        <div className='grid grid-cols-1 md:grid-cols-2'>
        <SearchBar
          searchOptions={searchOptions}
          onSearch={setSearchFilters}
          placeholder="Search rejected applications..."
          buttonText="Search"
          isDark={isDark}
        />
        </div>

        <DataTable
          columns={columns}
          data={paginatedData}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={setItemsPerPage}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={[10, 20, 50, 100]}
          totalItems={totalItems}
          isDark={isDark}
          emptyMessage="No rejected applications found"
          renderRow={(app, index) => (
            <RejectedTableRow
              key={app.id}
              application={{
                ...app,
                srNo: startIndex + index + 1,
                crnNo: app.crnNo || '—',
                enquiryDate: app.timeline?.createdAt,
                completeDate: app.timeline?.closedAt || app.timeline?.createdAt,
                rejectedDate: app.rejectedAt || app.timeline?.createdAt,
                name: app.customer?.name || '—',
                mobile: app.customer?.mobile || '—',
                email: app.customer?.email || '—',
                approvedAmount: app.loan?.amount || 0,
                roi: app.loan?.rate || 0,
                tenure: app.loan?.tenure || 0,
                rejectedReason: app.rejectedReason || '—',
              }}
              index={index}
              isDark={isDark}
              onRestore={handleRestore}
              onView={handleView}
            />
          )}
        />
      </div>
    </div>
  );
}