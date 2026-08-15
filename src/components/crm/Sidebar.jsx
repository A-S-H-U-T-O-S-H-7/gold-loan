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
  MdDashboard, MdReceipt, MdSecurity, MdSettings,
  MdLock, MdAttachMoney
} from "react-icons/md";
import { IoMdCash } from "react-icons/io";
import { GiGoldBar, GiBank } from "react-icons/gi";
import { RiAdminFill } from "react-icons/ri";
import { useAdminAuthStore } from '@/lib/store/authAdminStore';
import { useThemeStore } from '@/lib/store/useThemeStore';

// ============================================
// GOLD LOAN CRM - SIDEBAR MENU ITEMS
// ============================================
const allMenuItems = [
  {
    name: 'Dashboard',
    link: '/crm/dashboard',
    icon: <FaHome />,
    permissionKey: 'dashboard'
  },

  {
    name: 'Manage-Applications',
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
        name: 'Gold Release',
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
  {
    name: 'Active Loans',
    link: '/crm/active-loans',
    icon: <FaClock />,
    permissionKey: 'active_loans'
  },
  {
    name: 'Overdue Loans',
    link: '/crm/overdue-loans',
    icon: <FaClock />,
    permissionKey: 'overdue_loans'
  },
  {
    name: 'Closed Loans',
    link: '/crm/closed-loans',
    icon: <FaCheckCircle />,
    permissionKey: 'closed_loans'
  },

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
        icon: <FaTimesCircle />,
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
  const { hasPermission } = useAdminAuthStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter menu based on user permissions
  const filteredMenu = useMemo(() => {
    return allMenuItems
      .map(item => {
        if (item.isDropdown && item.subItems) {
          const filteredSubItems = item.subItems.filter(subItem => {
            if (!subItem.permissionKey) return true;
            return hasPermission(subItem.permissionKey);
          });
          if (filteredSubItems.length > 0) {
            return { ...item, subItems: filteredSubItems };
          }
          return null;
        }
        if (!item.permissionKey) return item;
        return hasPermission(item.permissionKey) ? item : null;
      })
      .filter(Boolean);
  }, [hasPermission]);

  const toggleDropdown = (itemName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isParentActive = (subItems) => {
    return subItems?.some(subItem => pathname === subItem.link);
  };

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
      {/* Mobile menu button - GOLD THEME */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`fixed top-3 left-4 z-[50] lg:hidden p-3 rounded-md shadow-lg transition-all duration-300 ${
          theme === "dark"
            ? 'bg-gray-800/90 hover:bg-gray-700/90 text-gold-400 border border-gray-600'
            : 'bg-white/90 hover:bg-gold-50 text-gold-600 border border-gold-200'
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

      {/* Sidebar - GOLD THEME */}
      <div
        className={`fixed top-0 left-0 h-full shadow-xl z-50 transition-all duration-300 ease-in-out ${
          theme === "dark"
            ? 'bg-gray-900/95 text-white border-r border-gray-700'
            : 'bg-white/98 text-gray-900 border-r border-gold-200'
        } backdrop-blur-md ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'
        } lg:translate-x-0 ${
          isExpanded ? 'lg:w-74' : 'lg:w-20'
        } flex flex-col overflow-hidden`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Logo Section */}
        <div className={`flex items-center justify-between px-4 py-6 border-b transition-all duration-200 ${
          theme === "dark" ? 'border-gray-700' : 'border-gold-200'
        }`}>
          <Link
            href="/crm/dashboard"
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            onClick={() => setIsMobileOpen(false)}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              theme === "dark" ? 'bg-gold-500/20 border border-gold-500/30' : 'bg-gold-50 border border-gold-200'
            }`}>
              <span className="text-xl">🏦</span>
            </div>
            {(isExpanded || isMobileOpen) && (
              <div className="ml-3 overflow-hidden">
                <span className="text-xl font-bold bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                  ATD
                </span>
              </div>
            )}
          </Link>

          {isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className={`lg:hidden p-2 rounded-lg transition-colors duration-200 ${
                theme === "dark"
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-gold-50 text-gray-600 hover:text-gold-600'
              }`}
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="flex flex-col px-3 space-y-2">
            {filteredMenu.map((item, index) => (
              <div key={index}>
                {item.isDropdown ? (
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`group cursor-pointer flex items-center justify-between w-full gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                      isParentActive(item.subItems)
                        ? theme === "dark"
                          ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg'
                        : theme === "dark"
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-gold-400'
                          : 'hover:bg-gold-50 text-gray-700 hover:text-gold-600'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${
                        isParentActive(item.subItems)
                          ? 'text-white'
                          : 'group-hover:scale-110'
                      }`}>
                        {item.icon}
                      </div>
                      {(isExpanded || isMobileOpen) && (
                        <span className="text-base font-medium whitespace-nowrap transition-all duration-200">
                          {item.name}
                        </span>
                      )}
                    </div>
                    {(isExpanded || isMobileOpen) && (
                      <div className={`transition-transform duration-200 ${
                        openDropdowns[item.name] ? 'rotate-90' : ''
                      }`}>
                        <FiChevronRight size={16} />
                      </div>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.link}
                    className={`group flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
                      pathname === item.link
                        ? theme === "dark"
                          ? 'bg-gradient-to-r from-gold-600 to-gold-500 text-white shadow-lg'
                          : 'bg-gradient-to-r from-gold-500 to-gold-600 text-white shadow-lg'
                        : theme === "dark"
                          ? 'hover:bg-gray-800 text-gray-300 hover:text-gold-400'
                          : 'hover:bg-gold-50 text-gray-700 hover:text-gold-600'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <div className={`text-xl flex-shrink-0 transition-colors duration-200 ${
                      pathname === item.link
                        ? 'text-white'
                        : 'group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </div>
                    {(isExpanded || isMobileOpen) && (
                      <span className="text-base font-medium whitespace-nowrap transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {item.isDropdown && openDropdowns[item.name] && (isExpanded || isMobileOpen) && (
                  <div className="mt-2 ml-4 space-y-1">
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.link}
                        className={`group flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-200 text-sm font-medium ${
                          pathname === subItem.link
                            ? theme === "dark"
                              ? 'bg-gold-600/80 text-white shadow-md'
                              : 'bg-gold-500/80 text-white shadow-md'
                            : theme === "dark"
                              ? 'hover:bg-gray-800/80 text-gray-400 hover:text-gold-300'
                              : 'hover:bg-gold-50/80 text-gray-600 hover:text-gold-600'
                        }`}
                        onClick={() => setIsMobileOpen(false)}
                      >
                        <div className={`text-lg flex-shrink-0 transition-colors duration-200 ${
                          pathname === subItem.link
                            ? 'text-white'
                            : 'group-hover:scale-110'
                        }`}>
                          {subItem.icon}
                        </div>
                        <span className="font-medium whitespace-nowrap">
                          {subItem.name}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}