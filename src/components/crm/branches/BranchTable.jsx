'use client';
import React from 'react';
import { FileText, Loader } from 'lucide-react';
import BranchRow from './BranchRow';

// Common Table Styles
const getHeaderStyles = (isDark) => ({
  headerClass: `px-2 py-2 text-left text-sm font-bold border-r ${
    isDark ? "text-gray-100 border-gray-600/40" : "text-gray-700 border-gray-300/40"
  }`,
  gradientClass: `border-b-2 ${
    isDark
      ? "bg-gradient-to-r from-gray-900 to-gray-800 border-crm-border"
      : "bg-gradient-to-r from-crm-accent-soft to-white border-crm-border"
  }`,
  tableClass: `rounded-2xl shadow-2xl border-2 overflow-hidden ${
    isDark
      ? "bg-gray-800 border-crm-border shadow-crm-soft"
      : "bg-white border-crm-border shadow-crm-soft"
  }`
});

const BranchTable = ({ 
  branches,
  isDark,
  onEdit,
  onToggleStatus,
  onDelete,
  isLoading = false
}) => {
  const styles = getHeaderStyles(isDark);

  return (
    <div className={styles.tableClass}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max" style={{ minWidth: "1200px" }}>
          <thead className={styles.gradientClass}>
            <tr>
              <th className={styles.headerClass} style={{ minWidth: "60px" }}>
                S.No.
              </th>
              <th className={styles.headerClass} style={{ minWidth: "120px" }}>
                Branch Code
              </th>
              <th className={styles.headerClass} style={{ minWidth: "150px" }}>
                Company & Manager
              </th>
              <th className={styles.headerClass} style={{ minWidth: "200px" }}>
                Contact Details
              </th>
              <th className={styles.headerClass} style={{ minWidth: "250px" }}>
                Address
              </th>
              <th className={styles.headerClass} style={{ minWidth: "100px" }}>
                Created Date
              </th>
              <th className={styles.headerClass} style={{ minWidth: "90px" }}>
                Status
              </th>
              <th className={`px-2 py-2 text-left text-sm font-bold ${
                isDark ? "text-gray-100" : "text-gray-700"
              }`} style={{ minWidth: "120px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                      Loading branches...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              branches.map((branch, index) => (
                <BranchRow
                  key={branch.id}
                  branch={branch}
                  index={index}
                  isDark={isDark}
                  onEdit={onEdit}
                  onToggleStatus={onToggleStatus}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Empty State */}
      {!isLoading && branches.length === 0 && (
        <div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <div className="flex flex-col items-center space-y-4">
            <FileText className="w-16 h-16 opacity-50" />
            <p className="text-lg font-medium">No branches found</p>
            <p className="text-sm">Click "Add Branch" to create your first branch</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchTable;


