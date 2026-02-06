import React from 'react';
import { 
  Zap, 
  Shield, 
  TrendingDown, 
  Clock,
  RefreshCw,
  CreditCard,
  BarChart,
  Heart,
  CheckCircle,
  X,
  IndianRupee,
  Sparkles,
  Target,
  Award,
  Star,
  Gem,
  Trophy,
  ChevronRight
} from 'lucide-react';

export default function Benefits() {
  const benefits = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Bank-grade vaults with 24/7 CCTV monitoring',
      color: 'blue',
      stats: 'Insured',
      bgColor: 'bg-linear-to-br from-blue-50 via-blue-50 to-white',
      borderColor: 'border-blue-100',
      iconBg: 'bg-linear-to-br from-blue-500 to-blue-600',
      textColor: 'text-blue-800'
    },
    {
      icon: TrendingDown,
      title: 'Low Interest',
      description: 'Starting from 0.79% per month',
      color: 'green',
      stats: '0.79%',
      bgColor: 'bg-linear-to-br from-emerald-50 via-emerald-50 to-white',
      borderColor: 'border-emerald-100',
      iconBg: 'bg-linear-to-br from-emerald-500 to-emerald-600',
      textColor: 'text-emerald-800'
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get money in just 30 minutes',
      color: 'purple',
      stats: '30 min',
      bgColor: 'bg-linear-to-br from-violet-50 via-violet-50 to-white',
      borderColor: 'border-violet-100',
      iconBg: 'bg-linear-to-br from-violet-500 to-violet-600',
      textColor: 'text-violet-800'
    },
    {
      icon: IndianRupee,
      title: 'Zero Fee',
      description: 'No processing charges above ₹1 Lakh loan',
      color: 'teal',
      stats: '0%',
      bgColor: 'bg-linear-to-br from-teal-50 via-teal-50 to-white',
      borderColor: 'border-teal-100',
      iconBg: 'bg-linear-to-br from-teal-500 to-teal-600',
      textColor: 'text-teal-800'
    },
    {
      icon: RefreshCw,
      title: 'Easy Renewal',
      description: 'Simple renewal with same gold',
      color: 'orange',
      stats: 'Renew',
      bgColor: 'bg-linear-to-br from-orange-50 via-orange-50 to-white',
      borderColor: 'border-orange-100',
      iconBg: 'bg-linear-to-br from-orange-500 to-orange-600',
      textColor: 'text-orange-800'
    },
    {
      icon: CreditCard,
      title: 'Multiple Options',
      description: 'Cash, UPI, bank transfer',
      color: 'pink',
      stats: '4 Ways',
      bgColor: 'bg-linear-to-br from-pink-50 via-pink-50 to-white',
      borderColor: 'border-pink-100',
      iconBg: 'bg-linear-to-br from-pink-500 to-pink-600',
      textColor: 'text-pink-800'
    },
    {
      icon: BarChart,
      title: 'High LTV',
      description: 'Up to 75% of gold value',
      color: 'rose',
      stats: '75%',
      bgColor: 'bg-linear-to-br from-rose-50 via-rose-50 to-white',
      borderColor: 'border-rose-100',
      iconBg: 'bg-linear-to-br from-rose-500 to-rose-600',
      textColor: 'text-rose-800'
    },
    {
      icon: Heart,
      title: 'No Penalty',
      description: 'Close anytime after 6 months',
      color: 'red',
      stats: 'Free',
      bgColor: 'bg-linear-to-br from-red-50 via-red-50 to-white',
      borderColor: 'border-red-100',
      iconBg: 'bg-linear-to-br from-red-500 to-red-600',
      textColor: 'text-red-800'
    }
  ];

  const keyDifferentiators = [
    {
      title: 'No CIBIL Check',
      description: 'Credit score doesn\'t matter',
      icon: Award,
      highlight: 'All Credit Scores',
      bgColor: 'bg-linear-to-br from-blue-50/70 via-white to-blue-50/30',
      borderColor: 'border-blue-200',
      iconBg: 'bg-linear-to-br from-blue-500 to-blue-600',
      iconColor: 'text-white',
      textColor: 'text-blue-900'
    },
    {
      title: 'No Income Proof',
      description: 'No salary slips needed',
      icon: Target,
      highlight: 'Everyone Eligible',
      bgColor: 'bg-linear-to-br from-emerald-50/70 via-white to-emerald-50/30',
      borderColor: 'border-emerald-200',
      iconBg: 'bg-linear-to-br from-emerald-500 to-emerald-600',
      iconColor: 'text-white',
      textColor: 'text-emerald-900'
    },
    {
      title: 'Get Gold Back',
      description: 'Repay and reclaim anytime',
      icon: Sparkles,
      highlight: 'Temporary Pledge',
      bgColor: 'bg-linear-to-br from-amber-50/70 via-white to-amber-50/30',
      borderColor: 'border-amber-200',
      iconBg: 'bg-linear-to-br from-amber-500 to-amber-600',
      iconColor: 'text-white',
      textColor: 'text-amber-900'
    },
    {
      title: 'Transparent',
      description: 'No hidden charges',
      icon: Star,
      highlight: 'Full Disclosure',
      bgColor: 'bg-linear-to-br from-violet-50/70 via-white to-violet-50/30',
      borderColor: 'border-violet-200',
      iconBg: 'bg-linear-to-br from-violet-500 to-violet-600',
      iconColor: 'text-white',
      textColor: 'text-violet-900'
    }
  ];

  const comparisonData = [
    {
      feature: 'Processing Time',
      goldLoan: '30 minutes',
      personal: '2-7 days',
      credit: 'Instant',
      property: '7-15 days'
    },
    {
      feature: 'Interest Rate',
      goldLoan: '0.79% p.m.',
      personal: '1.5% p.m.',
      credit: '3% p.m.',
      property: '1% p.m.'
    },
    {
      feature: 'CIBIL Check',
      goldLoan: 'No',
      personal: 'Yes',
      credit: 'Yes',
      property: 'Yes'
    },
    {
      feature: 'Income Proof',
      goldLoan: 'No',
      personal: 'Yes',
      credit: 'Yes',
      property: 'Yes'
    },
    {
      feature: 'Processing Fee',
      goldLoan: '0%',
      personal: '1-3%',
      credit: 'High',
      property: '1-2%'
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Section 1: Benefits That Make Sense - White/Blue linear */}
      <div className="relative py-6  md:py-8 bg-linear-to-b from-white via-blue-50 to-blue-300">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-300 to-cyan-300"></div>
        <div className="container mx-auto pb-8 px-4 sm:px-6 max-w-7xl relative z-10">
          {/* Header Section */}
          <div className="text-center mb-4 md:mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-linear-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Gem className="h-7 w-7 text-white" />
            </div>
          
            </div>
            
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 shadow-sm">
                <Trophy className="h-3 w-3 text-blue-600" />
                EXCLUSIVE BENEFITS
              </span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2 tracking-tight">
              Benefits That Make Sense
            </h2>
            
            <p className="text-gray-700 max-w-3xl mx-auto text-base md:text-lg mb-6 leading-relaxed">
              Experience gold loans redefined with customer-first benefits and complete transparency
            </p>
            
            <div className="flex justify-center">
              <div className="w-24 h-1 bg-linear-to-r from-blue-400 to-cyan-500 rounded-full"></div>
            </div>
          </div>

          {/* Benefits Grid - Compact spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${benefit.bgColor} border ${benefit.borderColor} hover:border-opacity-60`}
              >
                {/* Content */}
                <div className="relative">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg ${benefit.iconBg} shadow-md mb-4`}>
                    <benefit.icon className="h-5 w-5 text-white" />
                  </div>
                  
                  {/* Stats Badge */}
                  <div className={`absolute top-0 right-0 bg-white/90 text-xs font-bold px-3 py-1.5 rounded-full border ${benefit.borderColor}`}>
                    <span className={`${benefit.textColor}`}>
                      {benefit.stats}
                    </span>
                  </div>

                  {/* Content */}
                  <h4 className={`font-bold ${benefit.textColor} text-lg mb-2 group-hover:text-gray-900 transition-colors`}>
                    {benefit.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-8 h-8 bg-linear-to-bl ${benefit.iconBg} opacity-5 rounded-tr-xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: What Makes Us Different - Green/Gold linear */}
      <div className="relative py-4 md:py-6 bg-linear-to-b from-gray-50 via-emerald-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <div className="text-center mb-10 md:mb-12">
            
            <h3 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-gray-900 to-emerald-800 bg-clip-text text-transparent mb-3 tracking-tight">
              What Makes Us Different
            </h3>
            <p className="text-gray-700 max-w-2xl mx-auto text-base md:text-lg">
              Unique advantages that set us apart from traditional lenders
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {keyDifferentiators.map((item, index) => (
              <div 
                key={index}
                className={`relative rounded-xl p-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bgColor} border ${item.borderColor} hover:border-opacity-80 group`}
              >
                {/* Icon with background */}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${item.iconBg} shadow-md mb-2`}>
                  <item.icon className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                
                {/* Content */}
                <div className="space-y-1">
                  <h4 className={`font-bold ${item.textColor} text-lg group-hover:text-gray-900 transition-colors`}>
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full border border-white shadow-sm mt-2">
                    <span className={`text-xs font-semibold ${item.textColor}`}>
                      {item.highlight}
                    </span>
                  </div>
                </div>
                
                {/* Number Indicator */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full ${item.iconBg} flex items-center justify-center shadow-sm`}>
                  <span className="text-xs font-bold text-white">
                    {index + 1}
                  </span>
                </div>

                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 ${item.borderColor.replace('border-', 'bg-')} opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-b-xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 3: Comparison Table - White/Amber linear */}
      <div className="relative py-4 md:py-6 bg-linear-to-b from-purple-50  to-purple-200">
        <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-amber-400 to-orange-400"></div>
        <div className="container mx-auto px-3 sm:px-5 max-w-7xl relative z-10">
          {/* Comparison Table - Keep original as requested */}
          <div className="bg-white rounded-xl p-3 md:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-center mb-5 md:mb-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-linear-to-r from-amber-500 to-orange-500 rounded-lg mb-2 shadow-sm">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  Gold Loan vs Other Loans
                </h3>
                <p className="text-gray-600 text-sm">See why gold loans are the smarter choice</p>
              </div>
            </div>
            
            {/* Mobile View - Cards */}
            <div className="sm:hidden space-y-3">
              {comparisonData.map((row, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-linear-to-r from-gray-50 to-gray-100 px-3 py-2.5 font-bold text-gray-900 text-sm border-b border-gray-200">
                    {row.feature}
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex justify-between items-center bg-linear-to-r from-amber-50 to-amber-100/80 p-2.5 rounded-lg border border-amber-200">
                      <span className="text-sm font-semibold text-gray-800">Gold Loan</span>
                      <span className="text-sm font-bold text-amber-700 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1.5 text-green-500" />
                        {row.goldLoan}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-700">Personal Loan</span>
                      <span className="text-sm text-gray-700">{row.personal}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-700">Credit Card</span>
                      <span className="text-sm text-gray-700">{row.credit}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                      <span className="text-sm text-gray-700">Property Loan</span>
                      <span className="text-sm text-gray-700">{row.property}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Enhanced Table */}
            <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="bg-linear-to-r from-purple-50 to-gray-100 border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900 text-sm uppercase tracking-wider">Feature</th>
                    <th className="text-center py-3 px-4 font-bold text-white bg-linear-to-r from-amber-500 to-amber-600 text-sm">
                      <div className="flex items-center justify-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Gold Loan
                      </div>
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm bg-gray-50">Personal Loan</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm bg-gray-50">Credit Card</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600 text-sm bg-gray-50">Property Loan</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, rowIndex) => (
                    <tr key={rowIndex} className={`border-b border-gray-100 ${rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="py-3 px-4 font-semibold text-gray-900 text-sm">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-center bg-linear-to-r from-amber-50/50 to-amber-100/50">
                        <div className="flex items-center justify-center font-bold text-amber-700 text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          {row.goldLoan}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 text-sm">
                        {row.personal === 'Yes' ? (
                          <span className="text-red-600 flex items-center justify-center">
                            <X className="h-4 w-4 mr-1" />
                            {row.personal}
                          </span>
                        ) : row.personal}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 text-sm">
                        {row.credit === 'Yes' ? (
                          <span className="text-red-600 flex items-center justify-center">
                            <X className="h-4 w-4 mr-1" />
                            {row.credit}
                          </span>
                        ) : row.credit}
                      </td>
                      <td className="py-3 px-4 text-center text-gray-600 text-sm">
                        {row.property === 'Yes' ? (
                          <span className="text-red-600 flex items-center justify-center">
                            <X className="h-4 w-4 mr-1" />
                            {row.property}
                          </span>
                        ) : row.property}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Conclusion */}
            <div className="mt-5 p-3 bg-linear-to-r from-blue-50/80 to-amber-50/80 rounded-lg border border-amber-200/50">
              <p className="text-sm text-gray-700 text-center">
                <span className="font-bold text-amber-700">Bottom Line:</span> Gold loans are 
                <span className="font-semibold text-gray-900"> faster, cheaper, and easier</span> to get than other loan options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}