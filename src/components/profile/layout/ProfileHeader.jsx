"use client";
import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Bell, LogOut, User, Settings } from 'lucide-react';
import NotificationModal from '../modals/NotificationModal';

export default function Header({ user = null, onLogout = () => {}, isRefreshing = false }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [loadingNotificationId, setLoadingNotificationId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const profileMenuRef = useRef(null);

  // Default user if not provided
  const defaultUser = {
    fname: 'Amit',
    user_id: 'ATD123456',
    email: 'amit@atdmoney.com',
    role: 'Customer'
  };

  const currentUser = user || defaultUser;

  // Mock notifications for demo
  const mockNotifications = [
    {
      id: '1',
      subject: 'Gold Loan Approved',
      comment: 'Your gold loan of ₹2,50,000 has been approved. Visit branch to complete documentation.',
      status: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
      sender: 'Loan Department',
      type: 'approval'
    },
    {
      id: '2',
      subject: 'Gold Price Alert',
      comment: 'Gold rates increased by ₹150/g today. Your pledged gold value is now ₹3,45,000.',
      status: true,
      created_at: new Date(Date.now() - 86400000).toISOString(),
      sender: 'Market Updates',
      type: 'rate'
    }
  ];

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Initialize notifications
  useEffect(() => {
    setNotifications(mockNotifications);
    const unread = mockNotifications.filter(n => !n.status).length;
    setUnreadCount(unread);
  }, []);

  const handleNotificationClick = async (notification) => {
    if (expandedNotificationId === notification.id) {
      setExpandedNotificationId(null);
    } else {
      setExpandedNotificationId(notification.id);
      if (!notification.status) {
        setLoadingNotificationId(notification.id);
        setTimeout(() => {
          setNotifications(prev =>
            prev.map(n =>
              n.id === notification.id ? { ...n, status: true } : n
            )
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
          setLoadingNotificationId(null);
        }, 500);
      }
    }
  };

  // Click outside handlers for profile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleLogoutClick = async () => {
    if (typeof onLogout === 'function') {
      await onLogout();
    }
    setShowProfileMenu(false);
  };

  const closeNotifications = () => {
    setShowNotifications(false);
    setExpandedNotificationId(null);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full shadow-lg">
        {/* Main Header Container */}
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 overflow-hidden">
          {/* Wavy Background Design */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Animated gradient blobs */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-400/15 to-amber-300/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-t from-yellow-400/10 to-transparent rounded-full blur-3xl"></div>
            </div>

            {/* SVG Wave Pattern */}
            <svg className="absolute top-0 left-0 w-full h-full opacity-30" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="headerWave" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="20%" stopColor="#d97706" />
                  <stop offset="40%" stopColor="#b45309" />
                  <stop offset="60%" stopColor="#d97706" />
                  <stop offset="80%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="headerWaveDark" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1f2937" />
                  <stop offset="50%" stopColor="#374151" />
                  <stop offset="100%" stopColor="#1f2937" />
                </linearGradient>
              </defs>
              {/* Dark wave for depth */}
              <path
                fill="url(#headerWaveDark)"
                fillOpacity="0.1"
                d="M0,40 C200,90 400,20 600,60 C800,100 1000,30 1200,70 L1200,0 L0,0 Z"
              />
              {/* Main golden wave */}
              <path
                fill="url(#headerWave)"
                d="M0,30 C200,80 400,10 600,50 C800,90 1000,20 1200,60 L1200,0 L0,0 Z"
              />
            </svg>
          </div>

          {/* Dark top border accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-amber-600 to-gray-900 z-10"></div>

          {/* Content Container */}
          <div className="relative mx-auto px-3 sm:px-4 lg:px-6 py-2.5 md:py-3">
            <div className="flex items-center justify-between">
              {/* Left side - Logo & Brand */}
              <div className="flex items-center space-x-2 md:space-x-3">
                {/* Logo with white background and dark border */}
                <div className="relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl shadow-lg ring-2 ring-gray-900/10 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-500/20"></div>
                  <img
                    src="/logo.png"
                    alt="ATD Money Logo"
                    className="relative w-full h-full object-contain p-1"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = `
                        <div class="relative flex items-center justify-center w-full h-full">
                          <span class="text-xl font-bold bg-gradient-to-br from-amber-600 to-yellow-600 bg-clip-text text-transparent">ATD</span>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Brand Name & Welcome */}
                <div className="flex flex-col -space-y-0.5">
                  <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-gray-900 via-amber-700 to-gray-900 bg-clip-text text-transparent tracking-tight leading-tight">
                    ATD MONEY
                  </h1>
                  <p className="text-xs text-gray-700 font-medium">
                    Welcome, <span className="text-amber-700 font-semibold">{currentUser.fname}</span>
                    {isRefreshing && (
                      <span className="ml-1.5 text-xs text-amber-600">(Refreshing...)</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right side - Actions */}
              <div className="flex items-center space-x-1.5 md:space-x-2">
                {/* Notifications Button */}
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileMenu(false);
                  }}
                  className="relative p-2 bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 rounded-xl transition-all duration-300 hover:shadow-md border-2 border-gray-900/10 hover:border-amber-300"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-white shadow-lg">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Desktop Notification Dropdown */}
                {!isMobile && showNotifications && (
                  <div className="absolute right-4 md:right-6 top-full mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border-2 border-gray-900/10 overflow-hidden z-50">
                    {/* Header with dark background */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-2.5 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white font-semibold text-base">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            className={`px-4 py-2.5 border-b border-gray-100 cursor-pointer transition-all duration-200 ${
                              !notification.status
                                ? 'bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  {!notification.status && (
                                    <span className="w-2 h-2 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full"></span>
                                  )}
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {notification.subject}
                                  </h4>
                                </div>
                                {expandedNotificationId === notification.id && (
                                  <div className="mt-2 text-sm text-gray-700 bg-white/50 p-2 rounded-lg border border-amber-200">
                                    {notification.comment}
                                  </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Profile Menu */}
                <div
                  ref={profileMenuRef}
                  className="relative"
                  onMouseEnter={!isMobile ? () => setShowProfileMenu(true) : undefined}
                  onMouseLeave={!isMobile ? () => setShowProfileMenu(false) : undefined}
                >
                  <button
                    onClick={() => {
                      if (isMobile) {
                        setShowProfileMenu(!showProfileMenu);
                        setShowNotifications(false);
                      }
                    }}
                    className="flex items-center space-x-2 bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-yellow-50 rounded-xl px-2.5 md:px-3 py-1.5 transition-all duration-300 hover:shadow-md border-2 border-gray-900/10 hover:border-amber-300"
                    aria-label="Profile menu"
                  >
                    {/* Profile Avatar with dark border */}
                    <div className="relative">
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-white font-bold text-xs md:text-sm shadow-lg ring-2 ring-amber-400/50">
                        {currentUser.fname?.[0] || 'A'}
                      </div>
                      {/* Active indicator */}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gradient-to-br from-green-400 to-green-500 border-2 border-white rounded-full"></span>
                    </div>

                    <span className="hidden md:block text-sm font-semibold text-gray-900">
                      {currentUser.fname}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                  </button>

                  {/* Profile dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-900/10 overflow-hidden z-50">
                      {/* User Info with dark background */}
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-3 border-b border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-base shadow-lg">
                            {currentUser.fname?.[0] || 'A'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold truncate text-sm">
                              {currentUser.fname}
                            </p>
                            <p className="text-amber-300 text-xs font-medium">
                              {currentUser.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-700">
                          <p className="text-xs text-gray-300">
                            ID: <span className="text-amber-400 font-mono">{currentUser.user_id}</span>
                          </p>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button className="w-full px-4 py-2 text-left hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-colors flex items-center space-x-3 group">
                          <User className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                            My Profile
                          </span>
                        </button>
                        <button className="w-full px-4 py-2 text-left hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-colors flex items-center space-x-3 group">
                          <Settings className="w-4 h-4 text-gray-600 group-hover:text-amber-600" />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 font-medium">
                            Settings
                          </span>
                        </button>
                      </div>

                      {/* Logout with dark accent */}
                      <div className="border-t border-gray-200">
                        <button
                          onClick={handleLogoutClick}
                          className="w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-colors flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-900 group-hover:bg-red-600 flex items-center justify-center transition-colors">
                            <LogOut className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm text-gray-900 font-semibold group-hover:text-red-600">
                            Logout
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MOBILE NOTIFICATION MODAL */}
      {isMobile && showNotifications && (
        <NotificationModal
          notifications={notifications}
          expandedNotificationId={expandedNotificationId}
          loadingNotificationId={loadingNotificationId}
          onNotificationClick={handleNotificationClick}
          onClose={closeNotifications}
        />
      )}
    </>
  );
}