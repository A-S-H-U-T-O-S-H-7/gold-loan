'use client';
import React from 'react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Calendar,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  Briefcase,
  Map,
  Globe,
  Home,
  Smartphone,
  Hash
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';

const BranchRow = ({
  branch,
  index,
  isDark,
  onEdit,
  onToggleStatus,
  onDelete // Optional delete functionality
}) => {
  // Check if branch is active
  const isActive = branch.isActive === true;
  
  // Common cell styles
  const cellBase = "px-2 py-4 border-r";
  const cellBorder = isDark ? "border-gray-600/80" : "border-gray-300/90";
  const cellStyle = `${cellBase} ${cellBorder}`;
  
  // Text styles
  const textPrimary = isDark ? "text-gray-100" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-200" : "text-gray-700";
  const textAccent = "text-crm-primary-strong";
  const textSuccess = isDark ? "text-green-400" : "text-green-600";
  const textWarning = isDark ? "text-yellow-400" : "text-yellow-600";
  
  // Icon styles
  const iconAccent = `w-4 h-4 ${textAccent}`;
  const iconSuccess = `w-4 h-4 ${textSuccess}`;
  const iconWarning = `w-4 h-4 ${textWarning}`;

  // Row background styles
  const normalRowBg = index % 2 === 0
    ? isDark ? "bg-gray-700/30" : "bg-gray-50"
    : "";

  const normalHoverBg = isDark
    ? "hover:bg-gray-700/50"
    : "hover:bg-crm-accent-soft";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Handle edit button click
  const handleEdit = () => {
    if (onEdit) {
      onEdit(branch);
      toast.success('Edit mode enabled');
    }
  };

  // Handle status toggle
  const handleToggleStatus = async () => {
    if (!onToggleStatus || !branch.id) return;
    
    const action = isActive ? 'deactivate' : 'activate';
    const actionText = isActive ? 'Deactivate' : 'Activate';
    const branchName = branch.branchName || branch.branch_name || 'this branch';
    
    const result = await Swal.fire({
      title: `${actionText} Branch`,
      html: `Are you sure you want to ${action} <strong>${branchName}</strong>?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: isActive ? '#dc2626' : '#059669',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${actionText}!`,
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    });
    
    if (result.isConfirmed) {
      try {
        await onToggleStatus(branch.id);
        toast.success(`Branch ${action}d successfully!`);
      } catch (error) {
        toast.error(`Failed to ${action} branch. Please try again.`);
        console.error('Error toggling branch status:', error);
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!onDelete || !branch.id) return;
    
    const branchName = branch.branchName || branch.branch_name || 'this branch';
    
    const result = await Swal.fire({
      title: 'Delete Branch',
      html: `Are you sure you want to delete <strong>${branchName}</strong>?<br>This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: isDark ? '#1f2937' : '#ffffff',
      color: isDark ? '#f9fafb' : '#111827',
    });
    
    if (result.isConfirmed) {
      try {
        await onDelete(branch.id);
        toast.success(`Branch deleted successfully!`);
      } catch (error) {
        toast.error(`Failed to delete branch. Please try again.`);
        console.error('Error deleting branch:', error);
      }
    }
  };

  // Get status badge
  const getStatusBadge = () => {
    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${
          isActive
            ? isDark
              ? "bg-green-900/40 text-green-300 border-green-700"
              : "bg-green-100 text-green-700 border-green-300"
            : isDark
              ? "bg-red-900/40 text-red-300 border-red-700"
              : "bg-red-100 text-red-700 border-red-300"
        }`}
      >
        {isActive ? (
          <>
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </>
        ) : (
          <>
            <XCircle className="w-3 h-3" />
            <span>Inactive</span>
          </>
        )}
      </div>
    );
  };

  return (
    <tr
      className={`border-b transition-all duration-200 hover:shadow-lg ${normalRowBg} ${normalHoverBg} ${
        isDark
          ? "border-crm-border"
          : "border-crm-border"
      }`}
    >
      {/* S.No */}
      <td className={`${cellStyle} text-left`}>
        <span className={`font-medium ${textPrimary}`}>
          {index + 1}
        </span>
      </td>

      {/* Branch Code & Name */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Hash className={iconAccent} />
            <span className={`font-bold text-sm ${textPrimary}`}>
              {branch.branchCode}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Building2 className={iconWarning} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.branchName}
            </span>
          </div>
        </div>
      </td>

      {/* Company & Manager */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Briefcase className={iconAccent} />
            <span className={`text-sm font-medium ${textSecondary}`}>
              {branch.companyName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <User className={iconWarning} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.managerName}
            </span>
          </div>
        </div>
      </td>

      {/* Contact Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail className={iconAccent} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.email}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className={iconSuccess} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.phone}
            </span>
          </div>
          {branch.alternatePhone && (
            <div className="flex items-center space-x-2">
              <Smartphone className={iconWarning} />
              <span className={`text-sm ${textSecondary}`}>
                {branch.alternatePhone}
              </span>
            </div>
          )}
        </div>
      </td>

      {/* Address Details */}
      <td className={`${cellStyle} text-left`}>
        <div className="space-y-2">
          <div className="flex items-start space-x-2">
            <Home className={`${iconAccent} mt-0.5`} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.address}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className={iconWarning} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.city}, {branch.state}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className={iconSuccess} />
            <span className={`text-sm ${textSecondary}`}>
              {branch.pincode}
            </span>
          </div>
        </div>
      </td>

      {/* Created Date */}
      <td className={`${cellStyle} text-left`}>
        <div className="flex items-center space-x-2">
          <Calendar className={iconAccent} />
          <span className={`text-xs ${textSecondary}`}>
            {formatDate(branch.createdAt)}
          </span>
        </div>
      </td>

      {/* Status */}
      <td className={`${cellStyle} text-center`}>
        {getStatusBadge()}
      </td>

      {/* Actions */}
      <td className={`px-2 py-4 text-center`}>
        <div className="flex items-center justify-center space-x-2">
          {/* Edit Button */}
          <button
            onClick={handleEdit}
            className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
              isDark
                ? "bg-blue-900/50 hover:bg-blue-800 text-blue-300"
                : "bg-blue-100 hover:bg-blue-200 text-blue-700"
            }`}
            title="Edit Branch"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          
          {/* Status Toggle Button */}
          <button
            onClick={handleToggleStatus}
            className={`p-2 cursor-pointer rounded-lg transition-all duration-200 hover:scale-105 ${
              isActive
                ? isDark
                  ? "bg-red-900/50 hover:bg-red-800 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
                : isDark
                  ? "bg-green-900/50 hover:bg-green-800 text-green-300"
                  : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
            title={isActive ? "Deactivate" : "Activate"}
          >
            <Power className="w-4 h-4" />
          </button>

          {/* Delete Button (Optional) */}
          {onDelete && (
            <button
              onClick={handleDelete}
              className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                isDark
                  ? "bg-red-900/50 hover:bg-red-800 text-red-300"
                  : "bg-red-100 hover:bg-red-200 text-red-700"
              }`}
              title="Delete Branch"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default BranchRow;

