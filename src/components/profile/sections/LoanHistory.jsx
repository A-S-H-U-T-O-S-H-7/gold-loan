'use client';

import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LoanHistory() {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loanHistory = [
    {
      id: 'GL20231215432',
      amount: 'INR 1,75,000',
      type: 'Gold Loan',
      date: '15 Dec 2023',
      tenure: '6 months',
      status: 'Closed',
      interestPaid: 'INR 8,450',
      closureDate: '15 Jun 2024'
    },
    {
      id: 'GL20230912345',
      amount: 'INR 3,00,000',
      type: 'Gold Loan',
      date: '12 Sep 2023',
      tenure: '12 months',
      status: 'Closed',
      interestPaid: 'INR 28,500',
      closureDate: '12 Sep 2024'
    },
    // {
    //   id: 'GL20230607890',
    //   amount: 'INR 1,25,000',
    //   type: 'Gold Loan',
    //   date: '07 Jun 2023',
    //   tenure: '3 months',
    //   status: 'Closed',
    //   interestPaid: 'INR 3,375',
    //   closureDate: '07 Sep 2023'
    // },
    // {
    //   id: 'GL20230304567',
    //   amount: 'INR 2,50,000',
    //   type: 'Gold Loan',
    //   date: '04 Mar 2023',
    //   tenure: '6 months',
    //   status: 'Closed',
    //   interestPaid: 'INR 12,000',
    //   closureDate: '04 Sep 2023'
    // },
    // {
    //   id: 'GL20221120123',
    //   amount: 'INR 2,00,000',
    //   type: 'Gold Loan',
    //   date: '20 Nov 2022',
    //   tenure: '9 months',
    //   status: 'Closed',
    //   interestPaid: 'INR 15,800',
    //   closureDate: '20 Aug 2023'
    // },
    // {
    //   id: 'GL20220815789',
    //   amount: 'INR 1,50,000',
    //   type: 'Gold Loan',
    //   date: '15 Aug 2022',
    //   tenure: '6 months',
    //   status: 'Closed',
    //   interestPaid: 'INR 7,200',
    //   closureDate: '15 Feb 2023'
    // }
  ];

  const filteredLoans =
    filter === 'all'
      ? loanHistory
      : loanHistory.filter((loan) => loan.status.toLowerCase() === filter);

  // Pagination logic
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLoans = filteredLoans.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-cyan-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-600 px-5 py-3.5 border-b-2 border-cyan-400">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Loan History</h3>
            <p className="text-xs text-cyan-100">Your previous loan records</p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial sm:w-48">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search loans..."
                className="w-full pl-8 pr-3 py-1.5 text-sm border border-cyan-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              />
            </div>

            <button className="p-1.5 border border-cyan-300 rounded-lg hover:bg-cyan-50 bg-white">
              <Download className="h-4 w-4 text-cyan-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-5 py-3 bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-50 border-b border-cyan-200">
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'closed', 'active'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setFilter(tab);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                filter === tab
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                  : 'bg-white text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'all' && ` (${loanHistory.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-cyan-100 via-teal-100 to-cyan-100">
              <th className="py-2.5 px-4 text-left text-xs font-bold text-cyan-900 uppercase tracking-wide">Loan ID</th>
              <th className="py-2.5 px-4 text-left text-xs font-bold text-cyan-900 uppercase tracking-wide">Amount</th>
              <th className="py-2.5 px-4 text-left text-xs font-bold text-cyan-900 uppercase tracking-wide">Date</th>
              <th className="py-2.5 px-4 text-left text-xs font-bold text-cyan-900 uppercase tracking-wide">Status</th>
              <th className="py-2.5 px-4 text-left text-xs font-bold text-cyan-900 uppercase tracking-wide">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-100">
            {currentLoans.map((loan, index) => (
              <tr key={loan.id} className={`hover:bg-gradient-to-r hover:from-cyan-50 hover:via-teal-50/50 hover:to-cyan-50 transition ${
                index % 2 === 0 ? 'bg-white' : 'bg-cyan-50/30'
              }`}>
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-900 text-sm">{loan.id}</div>
                  <div className="text-xs text-gray-600">{loan.tenure}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="font-bold text-gray-900 text-sm">{loan.amount}</div>
                  <div className="text-xs text-gray-600">Interest: {loan.interestPaid}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900 font-medium">{loan.date}</div>
                  <div className="text-xs text-gray-600">Closed: {loan.closureDate}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {loan.status}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <button className="flex items-center text-cyan-700 hover:text-cyan-900 font-semibold text-sm hover:underline">
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-5 py-3 bg-gradient-to-r from-cyan-50 via-teal-50 to-cyan-50 border-t border-cyan-200">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-700 font-medium">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredLoans.length)} of {filteredLoans.length} loans
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border ${
                currentPage === 1
                  ? 'bg-cyan-100 text-cyan-400 border-cyan-200 cursor-not-allowed'
                  : 'bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  currentPage === index + 1
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md'
                    : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-1.5 rounded-lg border ${
                currentPage === totalPages
                  ? 'bg-cyan-100 text-cyan-400 border-cyan-200 cursor-not-allowed'
                  : 'bg-white text-cyan-700 border-cyan-300 hover:bg-cyan-50'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="px-5 py-3 bg-gradient-to-r from-cyan-100 via-teal-100 to-cyan-100 border-t border-cyan-200">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2.5 bg-white rounded-lg border border-cyan-200 shadow-sm">
            <div className="text-xl font-bold text-cyan-700">6</div>
            <div className="text-xs text-gray-700 font-medium">Total Loans</div>
          </div>
          <div className="text-center p-2.5 bg-white rounded-lg border border-cyan-200 shadow-sm">
            <div className="text-xl font-bold text-teal-600">₹75,325</div>
            <div className="text-xs text-gray-700 font-medium">Interest Paid</div>
          </div>
          <div className="text-center p-2.5 bg-white rounded-lg border border-cyan-200 shadow-sm">
            <div className="text-xl font-bold text-cyan-600">100%</div>
            <div className="text-xs text-gray-700 font-medium">Repayment</div>
          </div>
        </div>
      </div>

      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-500"></div>
    </div>
  );
}