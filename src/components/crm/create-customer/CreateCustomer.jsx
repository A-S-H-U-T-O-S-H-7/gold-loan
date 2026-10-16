'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { changePendingApplicationStatus, createCrmApplication, formatPendingApplicationForUI, getPendingApplications } from '@/lib/services/pendingApplicationService';
import { getCrmBranches } from '@/lib/services/branchService';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DateFilter from '@/components/crm/ui/DateFilter';
import NewLeadModal from '@/components/crm/create-customer/NewLeadModal';
import CreateCustomerTable from '@/components/crm/create-customer/CreateCustomerTable';
import StatusUpdateModal from '@/components/crm/application-modals/StatusUpdateModal';
import toast from 'react-hot-toast';

export default function CreateCustomerPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const user = useAdminAuthStore((state) => state.user);
  const [applications, setApplications] = useState([]);
  const [availableBranches, setAvailableBranches] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshIconKey, setRefreshIconKey] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusApplication, setStatusApplication] = useState(null);
  const [branchId, setBranchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });
  const [dateFilters, setDateFilters] = useState({ dateRange: { start: '', end: '' } });

  const searchOptions = [
    { value: 'application_no', label: 'Application No.' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'email', label: 'Email' },
    { value: 'all', label: 'All fields' },
  ];
  const staffBranchId = String(user?.branchId ?? user?.branch_id ?? '');
  const staffBranch = availableBranches.find((branch) => String(branch.id) === staffBranchId);
  const tableApplications = useMemo(
    () => applications.map(formatPendingApplicationForUI),
    [applications]
  );

  useEffect(() => {
    let active = true;
    getCrmBranches().then((list) => {
      if (!active) return;
      setAvailableBranches(list);
    }).catch(() => {
      // The list still shows the branch ID if this lookup is unavailable.
    });
    return () => { active = false; };
  }, [refreshKey]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getPendingApplications({
      page: currentPage,
      per_page: itemsPerPage,
      ...(searchFilters.term ? searchFilters.field && searchFilters.field !== 'all'
        ? { search_by: searchFilters.field, search_value: searchFilters.term }
        : { search: searchFilters.term } : {}),
      date_from: dateFilters.dateRange.start,
      date_to: dateFilters.dateRange.end,
      ...(branchId ? { branch_id: branchId } : {}),
    }).then((result) => {
      if (!active) return;
      setApplications(result.data || []);
      setTotalItems(result.pagination?.total || 0);
      setTotalPages(result.pagination?.total_pages || 0);
      setError('');
    }).catch((requestError) => {
      if (!active) return;
      setError(requestError.response?.data?.message || requestError.message || 'Could not load applications');
      setApplications([]);
      setTotalItems(0);
      setTotalPages(0);
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, [currentPage, itemsPerPage, searchFilters.field, searchFilters.term, dateFilters, branchId, refreshKey]);

  const handleNewLead = async (leadData) => {
    const newApp = await createCrmApplication(leadData);
    toast.success(`Application ${newApp.applicationNo || newApp.id} created successfully`);
    setCurrentPage(1);
    setRefreshKey((key) => key + 1);
  };

  const handleStatusUpdate = async (id, status, remark) => {
    await changePendingApplicationStatus(id, status, remark);
    toast.success('Application status changed');
    setRefreshKey((key) => key + 1);
  };

  return (
    <div className={`min-h-screen w-full min-w-0 max-w-full overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-gray-900' : 'bg-gold-50/30'
    }`}>
      <div className="w-full min-w-0 max-w-full p-3 sm:p-4 md:p-6">
        <PageHeader
          title="Create / Pending Applications"
          count={totalItems}
          isDark={isDark}
          actions={
            <div className="flex w-full flex-col gap-2 min-[420px]:flex-row sm:w-auto">
              <button
                type="button"
                onClick={() => { setRefreshIconKey((key) => key + 1); setRefreshKey((key) => key + 1); }}
                disabled={loading}
                aria-label="Refresh pending applications"
                className={`inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded border px-4 py-2 font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none ${
                  isDark ? 'border-gold-600 text-gold-300 hover:bg-gold-500/10' : 'border-gold-300 bg-white text-gold-700 hover:bg-gold-50'
                }`}
              >
                <RefreshCw key={refreshIconKey} className={`h-4 w-4 shrink-0 ${refreshIconKey > 0 ? 'animate-[spin_600ms_ease-in-out_1]' : ''}`} />
                Refresh
              </button>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className={`inline-flex min-w-0 flex-1 cursor-pointer items-center justify-center gap-2 rounded px-4 py-2 font-semibold text-white shadow-lg transition-colors sm:flex-none ${
                  isDark
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
                }`}
              >
                <Plus className="h-4 w-4 shrink-0" />
                Create Application
              </button>
            </div>
          }
        />

        <DateFilter onFilterChange={(filters) => { setCurrentPage(1); setDateFilters(filters); }} isDark={isDark} dateFormat="dd/mm/yyyy" />
        <div className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
          <div className="min-w-0">
            <SearchBar
              searchOptions={searchOptions}
              onSearch={(filters) => { setCurrentPage(1); setSearchFilters(filters); setRefreshKey((key) => key + 1); }}
              placeholder="Search application no., name or mobile..."
              buttonText="Search"
              isDark={isDark}
            />
          </div>
          <div className={`mb-6 min-w-0 rounded-xl border p-3 ${isDark ? 'bg-gray-800 border-gold-700/30' : 'bg-white border-gold-200 shadow-sm'}`}>
            <select id="pending-branch" aria-label="Filter by branch" value={branchId} onChange={(event) => { setCurrentPage(1); setBranchId(event.target.value); }} className={`w-full min-w-0 cursor-pointer rounded-lg border-2 px-3 py-2.5 ${isDark ? 'bg-gray-700 border-gold-600/50 text-white' : 'bg-white border-gold-300 text-gray-900'}`}>
              <option value="">All branch</option>
              {staffBranch && <option value={staffBranchId}>{staffBranch.name}</option>}
              <option value="unassigned">Unassigned website applications</option>
            </select>
          </div>
        </div>

        {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
        <CreateCustomerTable
          applications={tableApplications}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setCurrentPage(1); setItemsPerPage(size); }}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          isDark={isDark}
          loading={loading}
          onStatusClick={setStatusApplication}
        />

        <NewLeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleNewLead}
          branches={staffBranch ? [staffBranch] : []}
          defaultBranchId={user?.branchId ?? user?.branch_id}
          isDark={isDark}
        />
        <StatusUpdateModal
          isOpen={Boolean(statusApplication)}
          application={statusApplication}
          onClose={() => setStatusApplication(null)}
          onStatusUpdate={handleStatusUpdate}
          statusOptions={[
            { value: 'FOLLOW_UP', label: 'Follow-up' },
            { value: 'REJECTED', label: 'Reject' },
            { value: 'GOLD_EVALUATION', label: 'Gold Evaluation', disabled: !statusApplication?.kycVerified },
          ]}
          isDark={isDark}
          accent="gold"
          initialStatus=""
          requiredRemarkStatuses={['FOLLOW_UP', 'REJECTED']}
          showCurrentStatus
          showSuccessToast={false}
          preventSameStatus
        />
      </div>
    </div>
  );
}
