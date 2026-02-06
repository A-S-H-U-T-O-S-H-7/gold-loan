import React from 'react';
import { 
  CheckCircle, 
  UserCheck, 
  Home, 
  Calendar, 
  FileText,
  IndianRupee,
  Shield,
  ThumbsUp
} from 'lucide-react';

export default function Eligibility() {
  const eligibilityCriteria = [
    {
      icon: UserCheck,
      title: 'Age Requirement',
      description: '18 to 75 years',
      details: ['Minimum: 18 years', 'Maximum: 75 years'],
      color: 'blue',
      iconColor: 'text-blue-500',
      badgeColor: 'bg-blue-500',
      delay: 'delay-100'
    },
    {
      icon: Home,
      title: 'Residential Status',
      description: 'Indian Resident',
      details: ['Indian citizen', 'Valid address proof required'],
      color: 'purple',
      iconColor: 'text-purple-500',
      badgeColor: 'bg-purple-500',
      delay: 'delay-200'
    },
    {
      icon: Calendar,
      title: 'Loan Tenure',
      description: '3 to 36 months',
      details: ['Minimum: 3 months', 'Maximum: 36 months', 'Flexible repayment options'],
      color: 'green',
      iconColor: 'text-green-500',
      badgeColor: 'bg-green-500',
      delay: 'delay-300'
    },
    {
      icon: IndianRupee,
      title: 'Loan Amount',
      description: '₹10,000 to ₹5 Crore',
      details: ['Minimum: ₹10,000', 'No maximum limit', 'Based on gold value'],
      color: 'amber',
      iconColor: 'text-amber-500',
      badgeColor: 'bg-amber-500',
      delay: 'delay-400'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Minimal Documents',
      details: ['Aadhaar Card (Mandatory)', 'PAN Card (For loans above ₹5 lakh)', 'Address Proof'],
      color: 'pink',
      iconColor: 'text-pink-500',
      badgeColor: 'bg-pink-500',
      delay: 'delay-500'
    },
    {
      icon: Shield,
      title: 'Gold Requirements',
      description: 'Pure Gold Only',
      details: ['22K or 24K gold', 'No stones or gems', 'Must be hallmarked'],
      color: 'gray',
      iconColor: 'text-gray-600',
      badgeColor: 'bg-gray-600',
      delay: 'delay-600'
    }
  ];

  return (
    <section className="py-6 md:py-8 bg-linear-to-b from-white  to-gray-100">
      <div className="container mx-auto px-4">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-br from-amber-500 to-amber-600 rounded-xl shadow-md mb-3">
            <ThumbsUp className="h-6 w-6 text-white" />
          </div>
          
          <div className="mb-2">
            <span className="inline-block text-xs font-semibold text-amber-600 bg-amber-50 border px-3 py-1 rounded-full">
              SIMPLE ELIGIBILITY
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            <span className="bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              Easy Eligibility Criteria
            </span>
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-base">
            Get your gold loan with minimal requirements. No income proof, no CIBIL check, 
            no employment verification needed.
          </p>
        </div>

        {/* Compact Eligibility Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibilityCriteria.map((item, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-gray-300"
            >
              {/* Solid Color Accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${item.badgeColor}`}></div>
              
              <div className="p-3 md:p-4">
                {/* Header with Icon */}
                <div className="flex items-start mb-3">
                  <div className={`p-2 rounded-lg bg-${item.color}-100`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className={`text-base font-bold ${item.iconColor} mt-0.5`}>
                      {item.description}
                    </p>
                  </div>
                </div>
                
                {/* Details List */}
                <div className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className={`p-1 rounded mr-2 mt-0.5 bg-${item.color}-50`}>
                        <CheckCircle className={`h-3.5 w-3.5 ${item.iconColor}`} />
                      </div>
                      <span className="text-gray-700 text-sm">
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Eligibility Badge */}
                <div className=" mt-2 md:mt-4 pt-1 md:pt-3 border-t border-gray-100">
                  <div className="inline-flex items-center px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-green-50 border border-green-200">
                    <div className={`w-5 h-5 md:w-6 md:h-6 ${item.badgeColor} rounded-full flex items-center justify-center mr-2`}>
                      <CheckCircle className=" h-3 w-3  text-white" />
                    </div>
                    <span className="font-semibold text-green-700 text-sm">Eligible</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}