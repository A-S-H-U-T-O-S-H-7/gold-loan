import React from 'react';
import { X, CheckCircle, Clock, XCircle, User, IndianRupee, Calendar } from 'lucide-react';

const ReferralHistoryModal = ({ isOpen, onClose, referralStats }) => {
  if (!isOpen) return null;

  // Mock referral data
  const referrals = [
    { id: 1, name: 'Rahul Sharma', phone: '+91 98765 43210', date: '2024-01-15', status: 'completed', reward: '₹500' },
    { id: 2, name: 'Priya Patel', phone: '+91 87654 32109', date: '2024-01-12', status: 'pending', reward: '₹500' },
    { id: 3, name: 'Amit Kumar', phone: '+91 76543 21098', date: '2024-01-10', status: 'completed', reward: '₹500' },
    { id: 4, name: 'Neha Gupta', phone: '+91 65432 10987', date: '2024-01-08', status: 'failed', reward: '₹0' },
    { id: 5, name: 'Vikram Singh', phone: '+91 54321 09876', date: '2024-01-05', status: 'completed', reward: '₹500' },
    { id: 6, name: 'Sanya Verma', phone: '+91 43210 98765', date: '2024-01-02', status: 'pending', reward: '₹500' },
  ];

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl">
          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-purple-200">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Referral History</h2>
                    <p className="text-sm text-purple-100">Track your referral progress and earnings</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50 border-b">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-700">{referralStats.referrals}</div>
                  <div className="text-sm text-purple-600 font-medium">Total Referrals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{referralStats.success}</div>
                  <div className="text-sm text-green-600 font-medium">Success Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{referralStats.earnings}</div>
                  <div className="text-sm text-amber-600 font-medium">Total Earnings</div>
                </div>
              </div>
            </div>

            {/* Referral List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{referral.name}</h3>
                          <p className="text-sm text-gray-600">{referral.phone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{referral.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-gray-600" />
                            <span className="font-bold text-gray-800">{referral.reward}</span>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(referral.status)}`}>
                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                          </span>
                        </div>
                        {getStatusIcon(referral.status)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {referrals.length === 0 && (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center mb-4">
                    <User className="h-8 w-8 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Referrals Yet</h3>
                  <p className="text-gray-500">Start sharing your referral link to see friends here</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Note:</span> Rewards are credited within 24 hours of successful referral
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-indigo-800 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralHistoryModal;