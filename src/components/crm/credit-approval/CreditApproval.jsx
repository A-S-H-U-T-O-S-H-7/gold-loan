'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import CreditApprovalTableRow from '@/components/crm/credit-approval/CreditApprovalTableRow';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CreditApprovalListPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const router = useRouter();
  const { applications } = useLoanStore();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
  ];

  // Get applications ready for credit approval
  const eligibleApps = useMemo(() => {
    return applications.filter(app => app.status === 'OFFER_ACCEPTED');
  }, [applications]);

  const filteredData = useMemo(() => {
    let data = [...eligibleApps];
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    return data;
  }, [eligibleApps, searchFilters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('List refreshed');
    }, 500);
  };

  const handleExport = async () => {
    toast.success('Export started');
  };

  const handleReview = (appId) => {
    router.push(`/crm/credit-approval/${appId}`);
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'name', label: 'Customer', width: '160px' },
    { key: 'mobile', label: 'Mobile', width: '120px' },
    { key: 'offered', label: 'Offered', width: '120px' },
    { key: 'eligible', label: 'Eligible', width: '120px' },
    { key: 'status', label: 'Status', width: '110px' },
    { key: 'actions', label: 'Actions', width: '100px' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Credit Approval"
          count={totalItems}
          isDark={isDark}
          actions={
            <div className="flex gap-2">
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
                filename="credit-approval-applications"
                headers={['App ID', 'Name', 'Mobile', 'Offered', 'Eligible', 'Status']}
                isDark={isDark}
                disabled={filteredData.length === 0}
                onExport={handleExport}
              />
            </div>
          }
        />
       <div className='grid grid-cols-1 md:grid-cols-2'>
        <SearchBar
          searchOptions={searchOptions}
          onSearch={setSearchFilters}
          placeholder="Search applications..."
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
          emptyMessage="No applications ready for credit approval"
          renderRow={(app, index) => (
            <CreditApprovalTableRow
              key={app.id}
              application={app}
              index={index}
              isDark={isDark}
              startIndex={startIndex}
              onReview={handleReview}
            />
          )}
        />
      </div>
    </div>
  );
}