'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiMenu, FiX, FiChevronRight } from 'react-icons/fi';
import {
  FaHome, FaGem, FaUserPlus, FaPhone, FaHandHoldingUsd,
  FaFileInvoiceDollar, FaShieldAlt, FaMoneyBillWave, FaClock,
  FaCheckCircle, FaTimesCircle, FaBoxes, FaWallet, FaHistory,
  FaChartBar, FaCog, FaUsers, FaBuilding
} from 'react-icons/fa';
import {
  MdDashboard, MdPendingActions, MdDoneAll, MdCancel,
  MdAccountBalance, MdReceipt, MdSecurity, MdSettings,
  MdVerified, MdGold, MdStore, MdLock, MdAttachMoney
} from "react-icons/md";
import { IoMdCash } from "react-icons/io";
import { GiGoldBar,GiBank, GiExpense } from "react-icons/gi";
import { BsBank2 } from "react-icons/bs";
import { RiAdminFill } from "react-icons/ri";
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useThemeStore } from '@/lib/store/useThemeStore';

// ============================================
// GOLD LOAN CRM - SIDEBAR MENU ITEMS
// ============================================
const allMenuItems = [
  // ========== DASHBOARD ==========
  {
    name: 'Dashboard',
    link: '/crm/dashboard',
    icon: <FaHome />,
    permissionKey: 'dashboard'
  },

  // ========== APPLICATION PIPELINE ==========
  {
    name: 'Application Pipeline',
    icon: <FaBoxes />,
    isDropdown: true,
    isSection: true,
    subItems: [
      {
        name: 'Manage Loans',
        link: '/crm/manage-loans',
        icon: <MdDashboard />,
        permissionKey: 'manage_loans'
      },
      {
        name: 'Transaction',
        link: '/crm/transaction',
        icon: <FaMoneyBillWave />,
        permissionKey: 'transaction'
      },
      {
        name: 'Disbursement',
        link: '/crm/disbursement',
        icon: <FaHandHoldingUsd />,
        permissionKey: 'disbursement'
      },
      {
        name: 'Credit Approval',
        link: '/crm/credit-approval',
        icon: <FaShieldAlt />,
        permissionKey: 'credit_approval'
      },
      {
        name: 'Loan Offer',
        link: '/crm/loan-offer',
        icon: <FaFileInvoiceDollar />,
        permissionKey: 'loan_offer'
      },
      {
        name: 'Gold Evaluation',
        link: '/crm/gold-evaluation',
        icon: <FaGem />,
        permissionKey: 'gold_evaluation'
      },
      {
        name: 'Follow-Up',
        link: '/crm/follow-up',
        icon: <FaPhone />,
        permissionKey: 'follow_up'
      },
      {
        name: 'Create Customer',
        link: '/crm/create-customer',
        icon: <FaUserPlus />,
        permissionKey: 'create_customer'
      },
      {
        name: 'Reject Application',
        link: '/crm/rejected-applications',
        icon: <FaTimesCircle />,
        permissionKey: 'rejected_applications'
      },
    ]
  },

  // ========== LOAN MANAGEMENT ==========
  {
    name: 'Active / Overdue',
    link: '/crm/active-loans',
    icon: <FaClock />,
    permissionKey: 'active_loans',
    badge: 'Live'
  },

  // ========== COLLECTIONS ==========
  {
    name: 'Collections',
    icon: <IoMdCash />,
    isDropdown: true,
    isSection: true,
    subItems: [
      {
        name: 'Collect Payment',
        link: '/crm/collect-payment',
        icon: <FaMoneyBillWave />,
        permissionKey: 'collect_payment'
      },
      {
        name: 'Payment History',
        link: '/crm/payment-history',
        icon: <MdReceipt />,
        permissionKey: 'payment_history'
      },
    ]
  },

  // ========== GOLD OPERATIONS ==========
  {
    name: 'Gold Operations',
    icon: <GiGoldBar />,
    isDropdown: true,
    isSection: true,
    subItems: [
      {
        name: 'Vault Management',
        link: '/crm/vault-management',
        icon: <GiBank />,
        permissionKey: 'vault_management'
      },
      {
        name: 'Loan Closure & Gold Release',
        link: '/crm/gold-release',
        icon: <MdLock />,
        permissionKey: 'gold_release'
      },
      {
        name: 'Gold Rate Settings',
        link: '/crm/gold-rate-settings',
        icon: <MdAttachMoney />,
        permissionKey: 'gold_rate_settings'
      },
    ]
  },

  // ========== REPORTS ==========
  {
    name: 'Reports',
    icon: <FaChartBar />,
    isDropdown: true,
    isSection: true,
    subItems: [
      {
        name: 'Branch Reports',
        link: '/crm/branch-reports',
        icon: <FaBuilding />,
        permissionKey: 'branch_reports'
      },
      {
        name: 'Disbursement Reports',
        link: '/crm/disbursement-reports',
        icon: <FaHandHoldingUsd />,
        permissionKey: 'disbursement_reports'
      },
      {
        name: 'NPA Reports',
        link: '/crm/npa-reports',
        icon: <MdCancel />,
        permissionKey: 'npa_reports'
      },
      {
        name: 'Audit Logs',
        link: '/crm/audit-logs',
        icon: <MdSecurity />,
        permissionKey: 'audit_logs'
      },
    ]
  },

  // ========== ADMIN ==========
  {
    name: 'Admin Settings',
    icon: <FaCog />,
    isDropdown: true,
    isSection: true,
    subItems: [
      {
        name: 'Branch Management',
        link: '/crm/branch-management',
        icon: <FaBuilding />,
        permissionKey: 'branch_management'
      },
      {
        name: 'User Roles',
        link: '/crm/user-roles',
        icon: <FaUsers />,
        permissionKey: 'user_roles'
      },
      {
        name: 'System Config',
        link: '/crm/system-config',
        icon: <MdSettings />,
        permissionKey: 'system_config'
      },
      {
        name: 'User Management',
        link: '/crm/user-management',
        icon: <RiAdminFill />,
        permissionKey: 'user_management'
      },
    ]
  },

  // ========== CLIENT HISTORY ==========
  {
    name: 'Client History',
    link: '/crm/client-history',
    icon: <FaHistory />,
    permissionKey: 'client_history'
  },
];

// ============================================
// SIDEBAR COMPONENT
// ============================================
export default function Sidebar() {
  const pathname = usePathname();
  const { theme } = useThemeStore();
  const { hasPermission, permissions, branch_id: branchId } = useAdminAuthStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter menu based on user permissions
  const filteredMenu = useMemo(() => {
    if (!permissions) {
      return allMenuItems;
    }

    return allMenuItems
      .map(item => {
        // Handle dropdown items
        if (item.isDropdown && item.subItems) {
          const filteredSubItems = item.subItems.filter(subItem => {
            if (!subItem.permissionKey) return true;
            return hasPermission(subItem.permissionKey);
          });

          // Only show dropdown if it has visible sub-items
          if (filteredSubItems.length > 0) {
            return { ...item, subItems: filteredSubItems };
          }
          return null;
        }

        // Handle regular menu items
        if (!item.permissionKey) return item;
        return hasPermission(item.permissionKey) ? item : null;
      })
      .filter(Boolean);
  }, [hasPermission, permissions]);

  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isParentActive = (subItems) => {
    return subItems?.some(subItem => pathname === subItem.link);
  };

  // Auto-expand dropdowns based on active path
  useEffect(() => {
    filteredMenu.forEach(item => {
      if (item.isDropdown && isParentActive(item.subItems)) {
        setOpenDropdowns(prev => ({ ...prev, [item.name]: true }));
      }
    });
  }, [pathname, filteredMenu]);

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile menu button - Gold Themed */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-3 left-4 z-[50] lg:hidden p-3 rounded-xl shadow-lg transition-all duration-300 
          ${theme === "dark"
            ? 'bg-surface hover:bg-surface-hover text-gold-400 border border-border'
            : 'bg-white/90 hover:bg-gold-50 text-gold-600 border border-gold-200/50'
          } backdrop-blur-sm`}
      >
        {isMobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Gold Theme */}
      <div
        className={`fixed top-0 left-0 h-full shadow-2xl z-50 transition-all duration-300 ease-in-out
          ${theme === "dark"
            ? 'bg-surface/95 text-foreground border-r border-border'
            : 'bg-white/98 text-navy-900 border-r border-gold-100/50'
          } backdrop-blur-md 
          ${isMobileOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72'}
          lg:translate-x-0 ${isExpanded ? 'lg:w-72' : 'lg:w-20'}
          flex flex-col overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section - Gold Brand */}
        <div className={`flex items-center justify-between px-4 py-5 border-b transition-all duration-200 
          ${theme === "dark" ? 'border-border' : 'border-gold-100/50'}`}>
          <Link
            href="/crm/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          >
            {/* Gold Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center
              ${theme === "dark" ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-gold-50 border border-gold-200'}`}>
              <span className="text-xl">🏦</span>
            </div>
            {(isExpanded || isMobileOpen) && (
              <div className="ml-3 overflow-hidden">
                <span className="text-xl font-serif font-bold gold-gradient-text">
                  Gold Loan CRM
                </span>
                {branchId && (
                  <span className={`block text-xs ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`}>
                    Branch #{branchId}
                  </span>
                )}
              </div>
            )}
          </Link>

          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`p-2 rounded-lg transition-colors duration-200 ${theme === "dark"
                  ? 'hover:bg-surface-hover text-foreground-muted hover:text-foreground'
                  : 'hover:bg-gold-50 text-navy-400 hover:text-gold-600'
                }`}
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="flex flex-col px-3 space-y-1">
            {filteredMenu.map((item, index) => (
              <div key={index}>
                {item.isDropdown ? (
                  <div>
                    {/* Section Header */}
                    {item.isSection && (isExpanded || isMobileOpen) && (
                      <div className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider 
                        ${theme === "dark" ? 'text-foreground-muted' : 'text-navy-400'}`}>
                        {item.name}
                      </div>
                    )}

                    {/* Dropdown Button */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className={`group cursor-pointer flex items-center justify-between w-full gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium
                        ${isParentActive(item.subItems)
                          ? theme === "dark"
                            ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                            : 'bg-gold-50 text-gold-600 border border-gold-200'
                          : theme === "dark"
                            ? 'hover:bg-surface-hover text-foreground-secondary hover:text-foreground'
                            : 'hover:bg-gold-50/50 text-navy-600 hover:text-gold-600'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-xl flex-shrink-0 transition-colors duration-200
                          ${isParentActive(item.subItems)
                            ? 'text-gold-500'
                            : 'group-hover:text-gold-500'
                          }`}>
                          {item.icon}
                        </div>
                        {(isExpanded || isMobileOpen) && (
                          <span className="text-sm whitespace-nowrap transition-all duration-200">
                            {item.name}
                          </span>
                        )}
                      </div>
                      {(isExpanded || isMobileOpen) && (
                        <div className={`transition-transform duration-200 ${openDropdowns[item.name] ? 'rotate-90' : ''}`}>
                          <FiChevronRight size={14} />
                        </div>
                      )}
                    </button>

                    {/* Sub-items */}
                    {item.isDropdown && openDropdowns[item.name] && (isExpanded || isMobileOpen) && (
                      <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-gold-500/30 pl-3">
                        {item.subItems.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.link}
                            className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-sm
                              ${pathname === subItem.link
                                ? theme === "dark"
                                  ? 'bg-gold-500/20 text-gold-400'
                                  : 'bg-gold-50 text-gold-600'
                                : theme === "dark"
                                  ? 'hover:bg-surface-hover text-foreground-muted hover:text-foreground'
                                  : 'hover:bg-gold-50/50 text-navy-500 hover:text-gold-600'
                              }`}
                            onClick={() => setIsMobileOpen(false)}
                          >
                            <div className={`text-base flex-shrink-0 transition-colors duration-200
                              ${pathname === subItem.link
                                ? 'text-gold-500'
                                : 'group-hover:text-gold-500'
                              }`}>
                              {subItem.icon}
                            </div>
                            <span className="flex-1 whitespace-nowrap">
                              {subItem.name}
                            </span>
                            {subItem.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium
                                ${subItem.badge === 'Live' ? 'bg-green-500/20 text-green-600' :
                                  subItem.badge === 'Urgent' ? 'bg-red-500/20 text-red-600' :
                                  'bg-gold-500/20 text-gold-600'}`}>
                                {subItem.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Regular Menu Item */
                  <Link
                    href={item.link}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium
                      ${pathname === item.link
                        ? theme === "dark"
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          : 'bg-gold-50 text-gold-600 border border-gold-200'
                        : theme === "dark"
                          ? 'hover:bg-surface-hover text-foreground-secondary hover:text-foreground'
                          : 'hover:bg-gold-50/50 text-navy-600 hover:text-gold-600'
                      }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={`text-xl flex-shrink-0 transition-colors duration-200
                      ${pathname === item.link ? 'text-gold-500' : 'group-hover:text-gold-500'}`}>
                      {item.icon}
                    </div>
                    {(isExpanded || isMobileOpen) && (
                      <span className="text-sm whitespace-nowrap transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer - Branch Info */}
        {(isExpanded || isMobileOpen) && (
          <div className={`px-4 py-3 border-t text-xs ${theme === "dark" ? 'border-border text-foreground-muted' : 'border-gold-100/50 text-navy-400'}`}>
            <div className="flex items-center gap-2">
              <span>© 2026 Gold Loan CRM</span>
              <span className="w-1 h-1 rounded-full bg-gold-500/50"></span>
              <span>v1.0</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}