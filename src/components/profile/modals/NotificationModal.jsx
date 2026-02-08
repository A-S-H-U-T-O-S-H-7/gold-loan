"use client";
import { useState, useEffect, useRef } from 'react';
import { Bell, X, ChevronRight, Loader2, CheckCircle } from 'lucide-react';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  notifications, 
  unreadCount,
  onNotificationClick,
  expandedNotificationId,
  loadingNotificationId,
  isMobile,
  darkMode = false
}) => {
  const modalRef = useRef(null);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open on mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'payment':
        return '💰';
      case 'rate':
        return '📈';
      case 'appointment':
        return '📅';
      case 'reward':
        return '🎁';
      default:
        return '🔔';
    }
  };

  // For mobile - Fixed height modal
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[9999]">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Container with fixed height */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className={`relative w-full max-w-md h-[85vh] ${
              darkMode 
                ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
                : 'bg-white/95 backdrop-blur-md border-amber-200/50'
            } rounded-2xl shadow-2xl border flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className={`p-4 border-b ${
              darkMode ? 'border-gray-700' : 'border-amber-200/50'
            } flex items-center justify-between sticky top-0 ${
              darkMode ? 'bg-gray-800/95' : 'bg-white/95'
            } backdrop-blur-sm z-10`}>
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${
                  darkMode ? 'text-gray-100' : 'text-gray-900'
                } text-lg`}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className={`px-2 py-0.5 ${
                    darkMode 
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                      : 'bg-amber-100 text-amber-700'
                  } text-xs font-medium rounded-full`}>
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100'
                }`}
                aria-label="Close notifications"
              >
                <X className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </button>
            </div>

            {/* Content - Scrollable area */}
            <div className="flex-1 overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className={`h-full flex flex-col items-center justify-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                  <p className={`text-xs mt-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    Notifications will appear here in real-time
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`rounded-xl transition-all duration-300 cursor-pointer border-l-4 ${
                        !notification.status 
                          ? darkMode
                            ? 'bg-yellow-500/10 border-l-yellow-500'
                            : 'bg-amber-50/50 border-l-amber-500'
                          : darkMode
                            ? 'hover:bg-gray-700/50 border-l-transparent'
                            : 'hover:bg-amber-50 border-l-transparent'
                      }`}
                      onClick={() => onNotificationClick(notification)}
                    >
                      <div className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-3">
                            <div className="flex items-start gap-2">
                              <span className="text-lg mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </span>
                              <div className="flex-1">
                                <h4 className={`font-semibold ${
                                  darkMode ? 'text-gray-100' : 'text-gray-900'
                                } text-sm leading-snug`}>
                                  {notification.subject}
                                </h4>
                                <p className={`text-xs ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                } mt-1`}>
                                  {formatDate(notification.created_at)}
                                  {notification.status && (
                                    <span className={`ml-2 ${
                                      darkMode ? 'text-green-400' : 'text-green-600'
                                    } flex items-center gap-1`}>
                                      <CheckCircle className="w-3 h-3" />
                                      Read
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {!notification.status && (
                              <span className={`w-2 h-2 rounded-full animate-pulse ${
                                darkMode ? 'bg-yellow-400' : 'bg-amber-500'
                              }`}></span>
                            )}
                            <ChevronRight 
                              className={`w-4 h-4 transition-transform duration-300 ${
                                expandedNotificationId === notification.id ? 'rotate-90' : ''
                              } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            />
                          </div>
                        </div>
                      </div>

                      {expandedNotificationId === notification.id && (
                        <div className={`border-t ${
                          darkMode 
                            ? 'border-gray-700 bg-linear-to-br from-gray-800 to-yellow-900/10' 
                            : 'border-amber-200/50 bg-linear-to-br from-amber-50 to-yellow-50/30'
                        } overflow-hidden`}>
                          <div className="px-3 py-3">
                            {loadingNotificationId === notification.id ? (
                              <div className="flex items-center justify-center py-3">
                                <Loader2 className={`w-5 h-5 animate-spin ${
                                  darkMode ? 'text-yellow-400' : 'text-amber-600'
                                }`} />
                                <span className={`ml-2 text-sm ${
                                  darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>
                                  Marking as read...
                                </span>
                              </div>
                            ) : notification.comment ? (
                              <div className="space-y-2">
                                <div className={`text-xs font-medium uppercase tracking-wide ${
                                  darkMode ? 'text-yellow-400' : 'text-amber-600'
                                }`}>
                                  Message Details
                                </div>
                                <div 
                                  className={`text-sm leading-relaxed ${
                                    darkMode ? 'text-gray-300' : 'text-gray-700'
                                  }`}
                                  style={{ wordBreak: 'break-word' }}
                                >
                                  {notification.comment}
                                </div>
                                <div className="text-xs italic mt-2 flex items-center gap-1">
                                  <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                                    From: {notification.sender}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className={`text-sm italic py-2 ${
                                darkMode ? 'text-gray-400' : 'text-gray-400'
                              }`}>
                                No additional details available
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className={`p-3 border-t text-center text-xs ${
                darkMode ? 'border-gray-700 text-gray-400' : 'border-amber-200/50 text-gray-500'
              }`}>
                <div>
                  Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  {unreadCount > 0 && ` • ${unreadCount} unread`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // For desktop - Dropdown
  return (
    <div 
      ref={modalRef}
      className={`absolute right-0 mt-2 w-[450px] max-w-[90vw] ${
        darkMode 
          ? 'bg-gray-800/95 backdrop-blur-md border-gray-700' 
          : 'bg-white/95 backdrop-blur-md border-amber-200/50'
      } rounded-xl shadow-xl border z-[9999]`}
    >
      <div className={`p-4 border-b ${
        darkMode ? 'border-gray-700' : 'border-amber-200/50'
      } flex items-center justify-between`}>
        <div className="flex items-center space-x-2">
          <h3 className={`font-semibold ${
            darkMode ? 'text-gray-100' : 'text-gray-900'
          } text-lg`}>
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className={`px-2 py-0.5 ${
              darkMode 
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                : 'bg-amber-100 text-amber-700'
            } text-xs font-medium rounded-full`}>
              {unreadCount} new
            </span>
          )}
        </div>
        <button 
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-amber-100'
          }`}
        >
          <X className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className={`py-8 text-center ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No notifications yet</p>
            <p className={`text-xs mt-1 ${
              darkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              Notifications will appear here in real-time
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`transition-all duration-300 cursor-pointer border-l-4 ${
                  !notification.status 
                    ? darkMode
                      ? 'bg-yellow-500/10 border-l-yellow-500'
                      : 'bg-amber-50/50 border-l-amber-500'
                    : darkMode
                      ? 'hover:bg-gray-700/50 border-l-transparent'
                      : 'hover:bg-amber-50 border-l-transparent'
                }`}
                onClick={() => onNotificationClick(notification)}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 pr-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </span>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          } text-sm leading-snug`}>
                            {notification.subject}
                          </h4>
                          <p className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          } mt-1.5`}>
                            {formatDate(notification.created_at)}
                            {notification.status && (
                              <span className={`ml-2 ${
                                darkMode ? 'text-green-400' : 'text-green-600'
                              } flex items-center gap-1`}>
                                <CheckCircle className="w-3 h-3" />
                                Read
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {!notification.status && (
                        <span className={`w-2 h-2 rounded-full animate-pulse ${
                          darkMode ? 'bg-yellow-400' : 'bg-amber-500'
                        }`}></span>
                      )}
                      <ChevronRight 
                        className={`w-4 h-4 transition-transform duration-300 ${
                          expandedNotificationId === notification.id ? 'rotate-90' : ''
                        } ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                      />
                    </div>
                  </div>
                </div>

                {expandedNotificationId === notification.id && (
                  <div className={`border-t overflow-hidden transition-all duration-300 ${
                    darkMode 
                      ? 'border-gray-700 bg-linear-to-br from-gray-800 to-yellow-900/10' 
                      : 'border-amber-200/50 bg-linear-to-br from-amber-50 to-yellow-50/30'
                  }`}>
                    <div className="px-4 py-4">
                      {loadingNotificationId === notification.id ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className={`w-5 h-5 animate-spin ${
                            darkMode ? 'text-yellow-400' : 'text-amber-600'
                          }`} />
                          <span className={`ml-2 text-sm ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            Marking as read...
                          </span>
                        </div>
                      ) : notification.comment ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className={`text-xs font-medium uppercase tracking-wide ${
                              darkMode ? 'text-yellow-400' : 'text-amber-600'
                            }`}>
                              Message Details
                            </div>
                          </div>
                          <div 
                            className={`text-sm leading-relaxed ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}
                            style={{ wordBreak: 'break-word' }}
                          >
                            {notification.comment}
                          </div>
                          <div className="text-xs italic mt-2 flex items-center justify-between">
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                              From: {notification.sender}
                            </span>
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-500'}>
                              Type: {notification.type}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className={`text-sm italic py-2 ${
                          darkMode ? 'text-gray-400' : 'text-gray-400'
                        }`}>
                          No additional details available
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className={`p-3 border-t text-center text-xs ${
          darkMode ? 'border-gray-700 text-gray-400' : 'border-amber-200/50 text-gray-500'
        }`}>
          <div className="mt-1">
            Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
            {unreadCount > 0 && ` • ${unreadCount} unread`}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationModal;