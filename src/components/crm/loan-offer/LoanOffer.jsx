'use client';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DataTable from '@/components/crm/ui/DataTable';
import LoanOfferTableRow from '@/components/crm/loan-offer/LoanOfferTableRow';
import LoanOfferModal from '@/components/crm/loan-offer/LoanOfferModal';
import { loanService } from '@/lib/services/loanService';
import { useCrmList } from '@/lib/hooks/useCrmList';
import { formatCurrency } from '@/lib/utils/format';
import { RefreshCw } from 'lucide-react';

export default function LoanOfferPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const applications = useLoanStore((s) => s.applications);
  const config = useLoanStore((s) => s.config);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
  ];

  const rows = useMemo(() => {
    return applications.filter(app => app.status === 'GOLD_EVALUATED');
  }, [applications]);

  const list = useCrmList(rows, { searchKeys: ['id', 'customer.name', 'customer.mobile'] });

  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offer, setOffer] = useState({
    amount: '',
    rate: 12,
    tenure: 6,
    processingFee: 1.5,
    repaymentType: 'EMI',
    note: ''
  });

  const suggestedAmount = (row) => {
    return loanService.suggestedAmount(row) || 0;
  };

  const open = (row) => {
    const suggested = suggestedAmount(row);
    setSelected(row);
    setOffer({
      amount: row.loan?.offeredAmount || row.loan?.amount || suggested,
      rate: row.loan?.rate || config.interestRate || 12,
      tenure: row.loan?.tenure || 6,
      processingFee: row.loan?.processingFee || config.processingFee || 1.5,
      repaymentType: row.loan?.repaymentType || 'EMI',
      note: row.loan?.acceptanceNote || '',
    });
    setIsModalOpen(true);
  };

  const computed = loanService.calculateEmi(
    offer.amount,
    offer.rate,
    offer.tenure,
    offer.repaymentType
  );

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('List refreshed');
    }, 500);
  };

  const handleSavePending = () => {
    if (!selected) return;

    const eligible = suggestedAmount(selected);
    const amount = Number(offer.amount);

    if (!amount || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid loan amount.',
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (amount > eligible) {
      Swal.fire({
        title: 'Amount Exceeds Limit',
        text: `Loan amount cannot exceed eligible amount ₹${eligible.toLocaleString('en-IN')}`,
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    // ✅ Save Pending with Swal
    Swal.fire({
      title: 'Save as Pending?',
      text: 'This offer will be saved as pending for later.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#C9A84C',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Save',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        const offerData = {
          offeredAmount: amount,
          amount: amount,
          eligibleAmount: eligible,
          rate: Number(offer.rate),
          tenure: Number(offer.tenure),
          processingFee: Number(offer.processingFee),
          repaymentType: offer.repaymentType,
        };

        loanService.generateOffer(selected.id, offerData);
        toast.success('Offer saved as pending');
        setIsModalOpen(false);
        setSelected(null);
      }
    });
  };

  // ✅ Reject with Swal confirmation
  const handleReject = () => {
    if (!selected) return;

    Swal.fire({
      title: 'Reject Offer?',
      text: 'Are you sure you want to reject this loan offer?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        loanService.rejectOffer(selected.id, offer.note || 'Customer declined offer');
        toast.success('Offer rejected');
        setIsModalOpen(false);
        setSelected(null);
      }
    });
  };

  // ✅ Accept with Swal confirmation
  const handleAccept = () => {
    if (!selected) return;

    const eligible = suggestedAmount(selected);
    const amount = Number(offer.amount);

    if (!amount || amount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid loan amount.',
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (amount > eligible) {
      Swal.fire({
        title: 'Amount Exceeds Limit',
        text: `Loan amount cannot exceed eligible amount ₹${eligible.toLocaleString('en-IN')}`,
        icon: 'error',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    if (!offer.note.trim()) {
      Swal.fire({
        title: 'Note Required',
        text: 'Please add an acceptance note before accepting.',
        icon: 'warning',
        confirmButtonColor: '#C9A84C',
        background: isDark ? '#1a1a2e' : '#ffffff',
        color: isDark ? '#f3f4f6' : '#111827',
      });
      return;
    }

    Swal.fire({
      title: 'Accept Offer?',
      html: `
        <div style="text-align: left;">
          <p><strong>Customer:</strong> ${selected?.customer?.name}</p>
          <p><strong>Amount:</strong> ₹${amount.toLocaleString('en-IN')}</p>
          <p><strong>Rate:</strong> ${offer.rate}%</p>
          <p><strong>Tenure:</strong> ${offer.tenure} months</p>
          <p><strong>Note:</strong> ${offer.note}</p>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Accept!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        const offerData = {
          offeredAmount: amount,
          amount: amount,
          eligibleAmount: eligible,
          rate: Number(offer.rate),
          tenure: Number(offer.tenure),
          processingFee: Number(offer.processingFee),
          repaymentType: offer.repaymentType,
        };

        loanService.generateOffer(selected.id, offerData);
        loanService.acceptOffer(selected.id, offer.note);
        toast.success('Offer accepted — sent to credit approval');
        setIsModalOpen(false);
        setSelected(null);
      }
    });
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'name', label: 'Customer', width: '160px' },
    { key: 'mobile', label: 'Mobile', width: '120px' },
    { key: 'gold', label: 'Gold', width: '130px' },
    { key: 'eligible', label: 'Eligible', width: '120px' },
    { key: 'status', label: 'Status', width: '110px' },
    { key: 'actions', label: 'Actions', width: '100px' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6">
        <PageHeader
          title="Loan Offer"
          count={list.totalItems}
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
            </div>
          }
        />
       <div className='grid gid-cols-1 md:grid-cols-2'>
        <SearchBar
          searchOptions={searchOptions}
          onSearch={list.setSearch}
          placeholder="Search applications..."
          buttonText="Search"
          isDark={isDark}
        />
        </div> 

        <DataTable
          columns={columns}
          data={list.paged}
          currentPage={list.page}
          totalPages={list.totalPages}
          onPageChange={list.setPage}
          onPageSizeChange={list.setPageSize}
          itemsPerPage={list.pageSize}
          pageSizeOptions={[10, 20, 50, 100]}
          totalItems={list.totalItems}
          isDark={isDark}
          emptyMessage="No applications ready for loan offer"
          renderRow={(app, index) => (
            <LoanOfferTableRow
              key={app.id}
              application={app}
              index={index}
              isDark={isDark}
              startIndex={(list.page - 1) * list.pageSize}
              onOffer={open}
              suggestedAmount={suggestedAmount}
            />
          )}
        />

        {/* Loan Offer Modal */}
        <LoanOfferModal
          isOpen={isModalOpen}
          selected={selected}
          offer={offer}
          setOffer={setOffer}
          computed={computed}
          suggestedAmount={suggestedAmount}
          onClose={() => {
            setIsModalOpen(false);
            setSelected(null);
          }}
          onSavePending={handleSavePending}
          onReject={handleReject}
          onAccept={handleAccept}
          isDark={isDark}
        />
      </div>
    </div>
  );
}