'use client';
import { useMemo, useState } from 'react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import ManageLoansTabs from '@/components/crm/manage-loans/ManageLoansTabs';
import ManageLoansModal from '@/components/crm/manage-loans/ManageLoansModal';
import ManageLoansViewButton from '@/components/crm/action-buttons/ManageLoansViewButton';
import { paymentService } from '@/lib/services/paymentService';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../ui/StatusBadge';

export default function ManageLoansPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { applications } = useLoanStore();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });
  const [activeTab, setActiveTab] = useState('All');
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
  ];

  // Filter applications based on tab
  const filteredApps = useMemo(() => {
    let data = [...applications];
    
    // Tab filtering
    if (activeTab === 'Active') {
      data = data.filter(app => app.status === 'ACTIVE' || app.status === 'TRANSFERRED');
    } else if (activeTab === 'Overdue') {
      data = data.filter(app => app.status === 'OVERDUE' || app.status === 'NPA');
    } else if (activeTab === 'Closed') {
      data = data.filter(app => app.status === 'CLOSED');
    }
    // 'All' shows everything
    
    return data;
  }, [applications, activeTab]);

  const filteredData = useMemo(() => {
    let data = [...filteredApps];
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    return data;
  }, [filteredApps, searchFilters]);

  // Counts for tabs
  const counts = useMemo(() => {
    const all = applications.length;
    const active = applications.filter(app => app.status === 'ACTIVE' || app.status === 'TRANSFERRED').length;
    const overdue = applications.filter(app => app.status === 'OVERDUE' || app.status === 'NPA').length;
    const closed = applications.filter(app => app.status === 'CLOSED').length;
    return { All: all, Active: active, Overdue: overdue, Closed: closed };
  }, [applications]);

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

  const handleView = (app) => {
    setSelected(app);
    setIsModalOpen(true);
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'id', label: 'App ID', width: '110px', render: (r) => <span className="font-mono text-gold-600 dark:text-gold-400">{r.id}</span> },
    { key: 'name', label: 'Customer', width: '160px', render: (r) => r.customer?.name || '—' },
    { key: 'eligible', label: 'Eligible', width: '110px', render: (r) => formatCurrency(r.gold?.eligibleAmount || r.loan?.eligibleAmount || 0) },
    { key: 'amount', label: 'Approved', width: '110px', render: (r) => formatCurrency(r.loan?.approvedAmount || r.loan?.amount || 0) },
    { key: 'weight', label: 'Gold', width: '100px', render: (r) => r.gold ? `${r.gold.netWeight || 0}g` : '—' },
    { key: 'rate', label: 'Rate', width: '80px', render: (r) => r.loan ? `${r.loan.rate || 0}%` : '—' },
    { key: 'due', label: 'Next Due', width: '110px', render: (r) => formatDate(paymentService.nextDueOf(r)) },
    { key: 'out', label: 'Outstanding', width: '120px', render: (r) => <span className="font-mono">{formatCurrency(paymentService.outstandingOf(r))}</span> },
    { key: 'status', label: 'Status', width: '110px', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Actions', width: '80px', render: (r) => (
      <ManageLoansViewButton onClick={() => handleView(r)} isDark={isDark} />
    ) },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Manage Loans"
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
                filename="manage-loans"
                headers={['App ID', 'Customer', 'Eligible', 'Approved', 'Gold', 'Rate', 'Outstanding', 'Status']}
                isDark={isDark}
                disabled={filteredData.length === 0}
                onExport={handleExport}
              />
            </div>
          }
        />

        <ManageLoansTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          counts={counts}
          isDark={isDark}
        />

        <SearchBar
          searchOptions={searchOptions}
          onSearch={setSearchFilters}
          placeholder="Search loans..."
          buttonText="Search"
          isDark={isDark}
        />

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
          emptyMessage={`No ${activeTab.toLowerCase()} loans found`}
          renderRow={(app, index) => {
            return (
              <tr key={app.id} className={`border-b transition-all duration-200 hover:shadow-md ${isDark ? 'border-gold-700/30 hover:bg-gray-700/50' : 'border-gold-100 hover:bg-gold-50/50'} ${index % 2 === 0 ? (isDark ? 'bg-gray-800/50' : 'bg-white') : (isDark ? 'bg-gray-800/30' : 'bg-gold-50/30')}`}>
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 align-middle text-center text-sm border-r last:border-r-0 ${isDark ? 'border-gold-700/30' : 'border-gold-100'}`}>
                    {col.render ? col.render(app, index) : app[col.key]}
                  </td>
                ))}
              </tr>
            );
          }}
        />

        {/* Manage Loans Modal */}
        <ManageLoansModal
          isOpen={isModalOpen}
          application={selected}
          onClose={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
          isDark={isDark}
        />
      </div>
    </div>
  );
}