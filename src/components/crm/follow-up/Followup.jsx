'use client';
import { useState, useMemo } from 'react';
import { RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DateFilter from '@/components/crm/ui/DateFilter';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import FollowUpTableRow from '@/components/crm/follow-up/FollowUpTableRow';
import toast from 'react-hot-toast';

export default function FollowUpPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { applications } = useLoanStore();

  // Get only FOLLOW_UP applications
  const followUpApps = useMemo(() => {
    return applications.filter(app => app.status === 'FOLLOW_UP');
  }, [applications]);

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

  // Calculate days pending for each application
  const enrichedData = useMemo(() => {
    return followUpApps.map(app => {
      const createdAt = app.timeline?.createdAt || app.createdAt;
      const daysPending = createdAt 
        ? Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24))
        : 0;
      return { ...app, daysPending };
    });
  }, [followUpApps]);

  const filteredData = useMemo(() => {
    let data = [...enrichedData];
    
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    
    if (dateFilters.dateRange.start) {
      data = data.filter(app => {
        const date = new Date(app.timeline?.createdAt || app.createdAt);
        return date >= new Date(dateFilters.dateRange.start);
      });
    }
    if (dateFilters.dateRange.end) {
      data = data.filter(app => {
        const date = new Date(app.timeline?.createdAt || app.createdAt);
        return date <= new Date(dateFilters.dateRange.end);
      });
    }
    
    return data;
  }, [enrichedData, searchFilters, dateFilters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Follow-up list refreshed');
    }, 500);
  };

  const handleExport = async () => {
    toast.success('Export started');
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'call', label: 'Call', width: '80px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'crnNo', label: 'CRN No', width: '110px' },
    { key: 'name', label: 'Name', width: '160px' },
    { key: 'mobile', label: 'Mobile', width: '120px' },
    { key: 'daysPending', label: 'Days Pending', width: '110px' },
    { key: 'purpose', label: 'Purpose', width: '140px' },
    { key: 'status', label: 'Status', width: '110px' },
    { key: 'actions', label: 'Actions', width: '140px' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gold-50/30'
    }`}>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Follow-Up"
          count={totalItems}
          isDark={isDark}
          actions={
            <>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`px-4 py-2 rounded font-medium transition-all duration-200 flex items-center gap-2 cursor-pointer ${
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
                filename="follow-up-applications"
                headers={['App ID', 'Name', 'Mobile', 'Days Pending', 'Status']}
                isDark={isDark}
                disabled={filteredData.length === 0}
                onExport={handleExport}
              />
            </>
          }
        />

        <DateFilter onFilterChange={setDateFilters} isDark={isDark} />

       <div className='grid grid-cols-1 md:grid-cols-2'>
        <SearchBar
          searchOptions={searchOptions}
          onSearch={setSearchFilters}
          placeholder="Search follow-up applications..."
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
          emptyMessage="No follow-up applications found"
          renderRow={(app, index) => (
            <FollowUpTableRow
              key={app.id}
              application={app}
              index={index}
              isDark={isDark}
              startIndex={startIndex}
            />
          )}
        />
      </div>
    </div>
  );
}