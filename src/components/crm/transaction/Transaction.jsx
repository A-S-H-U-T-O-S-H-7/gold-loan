'use client';
import { useMemo, useState } from 'react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DataTable from '@/components/crm/ui/DataTable';
import ExportButton from '@/components/crm/ui/ExportButton';
import TransactionTableRow from '@/components/crm/transaction/TransactionTableRow';
import TransactionModal from '@/components/crm/transaction/TransactionModal';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function TransactionPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { applications, updateApplication, setStatus } = useLoanStore();
  const user = useAdminAuthStore((s) => s.user);
  const isFinance = /finance/i.test(user?.role || user?.name || '');

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [failReason, setFailReason] = useState('');

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Customer' },
    { value: 'transaction.referenceId', label: 'Reference ID' },
  ];

  // Get applications ready for transaction
  const eligibleApps = useMemo(() => {
    return applications.filter(app => 
      app.status === 'READY_FOR_TRANSFER' || 
      app.transaction?.status === 'SUCCESS' ||
      app.transaction?.status === 'FAILED'
    );
  }, [applications]);

  const filteredData = useMemo(() => {
    let data = [...eligibleApps];
    
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    
    // Filter by transaction status
    if (searchFilters.field === 'transaction.status' && searchFilters.term) {
      data = data.filter(app => {
        const status = app.transaction?.status || 'PENDING';
        return status.toLowerCase().includes(searchFilters.term.toLowerCase());
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

  const handleTransfer = (app) => {
    setSelected(app);
    setReferenceId(app.transaction?.referenceId || '');
    setFailReason('');
    setIsModalOpen(true);
  };

  const handleConfirmTransfer = () => {
    if (!selected) return;
    
    if (!referenceId.trim()) {
      toast.error('Please enter a reference ID');
      return;
    }

    Swal.fire({
      title: 'Confirm Transfer?',
      text: `This will mark ${selected.id} as transferred.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Confirm!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        // Update application with transaction details
        updateApplication(selected.id, {
          transaction: {
            status: 'SUCCESS',
            referenceId: referenceId,
            completedAt: new Date().toISOString(),
            mode: selected.disbursement?.mode || 'Bank Transfer'
          }
        });
        
        setStatus(selected.id, 'TRANSFERRED');
        toast.success('Transfer completed successfully!');
        setIsModalOpen(false);
        setSelected(null);
      }
    });
  };

  const handleFailTransfer = () => {
    if (!selected) return;

    Swal.fire({
      title: 'Mark as Failed?',
      text: 'This will mark the transfer as failed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Mark Failed',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        updateApplication(selected.id, {
          transaction: {
            status: 'FAILED',
            failureReason: failReason || 'Transfer failed',
            failedAt: new Date().toISOString()
          }
        });
        
        setStatus(selected.id, 'READY_FOR_TRANSFER');
        toast.error('Transfer marked as failed');
        setIsModalOpen(false);
        setSelected(null);
      }
    });
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'customer', label: 'Customer', width: '160px' },
    { key: 'amount', label: 'Amount', width: '120px' },
    { key: 'mode', label: 'Mode', width: '120px' },
    { key: 'ref', label: 'Reference', width: '130px' },
    { key: 'status', label: 'Transfer', width: '110px' },
    { key: 'actions', label: 'Actions', width: '100px' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Transaction"
          count={totalItems}
          isDark={isDark}
          description="Finance ledger — pending, success and failed transfers"
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
                filename="transaction-applications"
                headers={['App ID', 'Customer', 'Amount', 'Mode', 'Reference', 'Status']}
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
          placeholder="Search transactions..."
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
          emptyMessage="No transactions found"
          renderRow={(app, index) => (
            <TransactionTableRow
              key={app.id}
              application={app}
              index={index}
              isDark={isDark}
              startIndex={startIndex}
              onTransfer={handleTransfer}
              isFinance={isFinance}
            />
          )}
        />

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          selected={selected}
          referenceId={referenceId}
          setReferenceId={setReferenceId}
          failReason={failReason}
          setFailReason={setFailReason}
          onClose={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
          onConfirm={handleConfirmTransfer}
          onFail={handleFailTransfer}
          isDark={isDark}
          isFinance={isFinance}
        />
      </div>
    </div>
  );
}