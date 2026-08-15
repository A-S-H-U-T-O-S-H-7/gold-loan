'use client';
import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import PageHeader from '@/components/crm/ui/PageHeader';
import SearchBar from '@/components/crm/ui/SearchBar';
import DateFilter from '@/components/crm/ui/DateFilter';
import DataTable from '@/components/crm/ui/DataTable';
import NewLeadModal from '@/components/crm/create-customer/NewLeadModal';
import CreateCustomerTableRow from '@/components/crm/create-customer/CreateCustomerTableRow';
import toast from 'react-hot-toast';

export default function CreateCustomerPage() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { applications, addApplication } = useLoanStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchFilters, setSearchFilters] = useState({ field: '', term: '' });
  const [dateFilters, setDateFilters] = useState({ dateRange: { start: '', end: '' } });

  const searchOptions = [
    { value: 'id', label: 'App ID' },
    { value: 'name', label: 'Name' },
    { value: 'mobile', label: 'Mobile' },
  ];

  const filteredData = useMemo(() => {
    let data = [...applications];
    
    if (searchFilters.term && searchFilters.field) {
      data = data.filter(app => {
        const value = app[searchFilters.field] || app.customer?.[searchFilters.field] || '';
        return String(value).toLowerCase().includes(searchFilters.term.toLowerCase());
      });
    }
    
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
  }, [applications, searchFilters, dateFilters]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleNewLead = (leadData) => {
    const newApp = addApplication({
      customer: {
        name: leadData.name,
        mobile: leadData.mobile,
        email: leadData.email || '',
        purpose: leadData.purpose || '',
      },
      status: 'DRAFT'
    });
    toast.success(`Lead ${newApp.id} created successfully`);
  };

  const columns = [
    { key: 'srNo', label: 'SR No', width: '70px' },
    { key: 'call', label: 'Call', width: '80px' },
    { key: 'id', label: 'App ID', width: '110px' },
    { key: 'crnNo', label: 'CRN No', width: '110px' },
    { key: 'name', label: 'Name', width: '160px' },
    { key: 'mobile', label: 'Mobile', width: '120px' },
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
          title="Create Customer"
          count={totalItems}
          isDark={isDark}
          actions={
            <button
              onClick={() => setIsModalOpen(true)}
              className={`px-4 py-2 rounded font-semibold transition-all duration-200 hover:scale-105 cursor-pointer text-white shadow-lg hover:shadow-xl flex items-center gap-2 ${
                isDark
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                  : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
              }`}
            >
              <Plus className="w-4 h-4" />
              New Lead
            </button>
          }
        />

        <DateFilter onFilterChange={setDateFilters} isDark={isDark} />
        <div className='grid grid-cols-1 md:grid-cols-2'>
        <SearchBar
          searchOptions={searchOptions}
          onSearch={setSearchFilters}
          placeholder="Search leads..."
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
          emptyMessage="No leads found. Create a new lead!"
          renderRow={(app, index) => (
            <CreateCustomerTableRow
              key={app.id}
              application={app}
              index={index}
              isDark={isDark}
              startIndex={startIndex}
            />
          )}
        />

        <NewLeadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleNewLead}
          isDark={isDark}
        />
      </div>
    </div>
  );
}