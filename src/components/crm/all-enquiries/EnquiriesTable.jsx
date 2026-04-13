import React from "react";
import { FileText } from "lucide-react";
import EnquiriesRow from "./EnquiriesRow";
import Pagination from "../Pagination";

const EnquiriesTable = ({ 
  paginatedEnquiries,
  filteredEnquiries,
  currentPage,
  totalPages,
  itemsPerPage,
  isDark,
  onPageChange,
  onPageSizeChange, 
  pageSizeOptions,
  loading,
  fileLoading,
  loadingFileName
}) => {

  const sourcePage = 'all';

  // Common header style
  const headerStyle = `px-2 py-3 text-center text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
  }`;

  const tableHeaders = [
    { label: "SR. No.", width: "80px" },
    { label: "Status", width: "90px" },
    { label: "Enquiry Source", width: "80px" },
    { label: "Branch", width: "80px" },
    { label: "CRN No", width: "80px" },
    { label: "Enquiry Date", width: "100px" },
    { label: "Enquiry Time", width: "110px" },
    { label: "Name", width: "150px" },
    { label: "Current Address", width: "180px" },
    { label: "Current State", width: "110px" },
    { label: "Current City", width: "110px" },
    { label: "Address", width: "180px" },
    { label: "State", width: "80px" },
    { label: "City", width: "80px" },
    { label: "Phone No.", width: "90px" },
    { label: "E-mail", width: "200px" },
    { label: "Photo", width: "80px" },
    { label: "Pan Card", width: "100px" },
    { label: "Address Proof", width: "120px" },
    { label: "ID Proof", width: "100px" },
    { label: "KYC Status", width: "120px" },
  ];

  if (loading && paginatedEnquiries.length === 0) {
    return (
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-crm-border shadow-crm-soft"
          : "bg-white border-crm-border shadow-crm-soft"
      }`}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crm-primary mx-auto mb-4"></div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>Loading enquiries...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`rounded-2xl shadow-2xl border-2 overflow-hidden ${
        isDark
          ? "bg-gray-800 border-crm-border shadow-crm-soft"
          : "bg-white border-crm-border shadow-crm-soft"
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-max" style={{ minWidth: "1500px" }}>
            <thead className={`border-b-2 ${
              isDark
                ? "bg-gradient-to-r from-gray-900 to-gray-800 border-crm-border"
                : "bg-gradient-to-r from-crm-accent-soft to-white border-crm-border"
            }`}>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th 
                    key={index}
                    className={headerStyle}
                    style={{ minWidth: header.width }}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedEnquiries.map((enquiry, index) => (
                <EnquiriesRow
                  key={enquiry.id}
                  enquiry={enquiry} 
                  index={index}
                  isDark={isDark}
                  sourcePage={sourcePage}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {paginatedEnquiries.length === 0 && !loading && (
          <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            <div className="flex flex-col items-center space-y-4">
              <FileText className="w-16 h-16 opacity-50" />
              <p className="text-lg font-medium">No enquiries found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
        
        {totalPages > 0 && paginatedEnquiries.length > 0 && (
          <div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={filteredEnquiries.length}  
              itemsPerPage={itemsPerPage} 
              onPageSizeChange={onPageSizeChange} 
              pageSizeOptions={pageSizeOptions}  
            />
          </div>
        )}
      </div>
    </>
  );
};

export default EnquiriesTable;
