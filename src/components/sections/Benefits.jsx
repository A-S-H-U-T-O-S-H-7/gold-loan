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
      linear: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingDown,
      title: 'Low Interest',
      description: 'Starting from 0.79% per month',
      color: 'green',
      stats: '0.79%',
      linear: 'from-emerald-500 to-green-500'
    },
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get money in just 30 minutes',
      color: 'purple',
      stats: '30 min',
      linear: 'from-violet-500 to-purple-500'
    },
    {
      icon: IndianRupee,
      title: 'Zero Fee',
      description: 'No processing charges above ₹1 Lakh loan',
      color: 'emerald',
      stats: '0%',
      linear: 'from-teal-500 to-emerald-500'
    },
    {
      icon: RefreshCw,
      title: 'Easy Renewal',
      description: 'Simple renewal with same gold',
      color: 'orange',
      stats: 'Renew',
      linear: 'from-orange-500 to-amber-500'
    },
    {
      icon: CreditCard,
      title: 'Multiple Options',
      description: 'Cash, UPI, bank transfer',
      color: 'pink',
      stats: '4 Ways',
      linear: 'from-pink-500 to-rose-500'
    },
    {
      icon: BarChart,
      title: 'High LTV',
      description: 'Up to 75% of gold value',
      color: 'rose',
      stats: '75%',
      linear: 'from-rose-500 to-red-500'
    },
    {
      icon: Heart,
      title: 'No Penalty',
      description: 'Close anytime after 6 months',
      color: 'red',
      stats: 'Free',
      linear: 'from-rose-500 to-pink-500'
    }
  ];

  const keyDifferentiators = [
    {
      title: 'No CIBIL Check',
      description: 'Credit score doesn\'t matter',
      icon: Award,
      highlight: 'All Credit Scores',
      iconColor: 'text-blue-500',
      borderColor: 'border-blue-200',
      bgColor: 'bg-linear-to-br from-blue-50 to-indigo-50'
    },
    {
      title: 'No Income Proof',
      description: 'No salary slips needed',
      icon: Target,
      highlight: 'Everyone Eligible',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-200',
      bgColor: 'bg-linear-to-br from-emerald-50 to-teal-50'
    },
    {
      title: 'Get Gold Back',
      description: 'Repay and reclaim anytime',
      icon: Sparkles,
      highlight: 'Temporary Pledge',
      iconColor: 'text-amber-500',
      borderColor: 'border-amber-200',
      bgColor: 'bg-linear-to-br from-amber-50 to-orange-50'
    },
    {
      title: 'Transparent',
      description: 'No hidden charges',
      icon: Star,
      highlight: 'Full Disclosure',
      iconColor: 'text-violet-500',
      borderColor: 'border-violet-200',
      bgColor: 'bg-linear-to-br from-violet-50 to-purple-50'
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
    <section className="relative py-3 md:py-6  bg-white overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-amber-50/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-blue-50/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-2 bg-linear-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-2">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Gem className="h-7 w-7 text-white" />
            </div>
          </div>
          
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-amber-700 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
              <Trophy className="h-4 w-4" />
              EXCLUSIVE BENEFITS
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Benefits That Make Sense
          </h2>
          
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg mb-6">
            Experience gold loans redefined with customer-first benefits and complete transparency
          </p>
          
          <div className="flex justify-center">
            <div className="w-20 h-1 bg-linear-to-r from-amber-400 to-orange-400 rounded-full"></div>
          </div>
        </div>

        {/* Benefits Grid with Visible linears */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:border hover:border-gray-200 border border-gray-100"
            >
              {/* linear Background - Always Visible */}
              <div 
                className={`absolute inset-0 bg-linear-to-br shadow-2xl ${benefit.linear} opacity-[1] rounded-2xl`}
              ></div>
              
              {/* Content */}
              <div className="relative">
                {/* Icon Container with linear */}
                <div className={`inline-flex items-center justify-center p-3 rounded-xl bg-linear-to-br ${benefit.linear} shadow-sm mb-3`}>
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                
                {/* Stats Badge */}
                <div className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-sm font-bold px-3 py-1.5 rounded-full border border-white/20 shadow-sm`}>
                  <span className={`bg-linear-to-r ${benefit.linear} bg-clip-text text-transparent`}>
                    {benefit.stats}
                  </span>
                </div>

                {/* Content */}
                <h4 className="font-bold text-gray-100 text-base mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-200 text-sm leading-relaxed mb-3">
                  {benefit.description}
                </p>
                
                
              </div>
              
              {/* Hover Effect Border */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-opacity-30 group-hover:border-linear-to-br ${benefit.linear} transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Key Differentiators Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              What Makes Us Different
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Unique advantages that set us apart from traditional lenders
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyDifferentiators.map((item, index) => (
              <div 
                key={index}
                className={`relative rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${item.bgColor} ${item.borderColor} border`}
              >
                {/* Icon with Background */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${item.iconColor} bg-white border ${item.borderColor} shadow-sm mb-3`}>
                  <item.icon className="h-6 w-6" strokeWidth={2} />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-900 text-base">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                  
                  {/* Highlight Badge */}
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
                    <span className="text-xs font-medium text-gray-700">
                      {item.highlight}
                    </span>
                  </div>
                </div>
                
                {/* Number Indicator */}
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">
                    {index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-linear-to-r from-amber-500 to-amber-600 rounded-lg mb-2">
                <Target className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
                Gold Loan vs Other Loans
              </h3>
              <p className="text-sm text-gray-600">See why gold loans are the smarter choice</p>
            </div>
          </div>
          
          {/* Mobile View - Cards */}
          <div className="md:hidden space-y-3">
            {comparisonData.map((row, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-3 py-2 font-bold text-gray-900 text-sm border-b">
                  {row.feature}
                </div>
                <div className="p-2 space-y-1.5">
                  <div className="flex justify-between items-center bg-linear-to-r from-amber-50 to-amber-100 p-2 rounded border border-amber-200">
                    <span className="text-xs font-medium text-gray-700">Gold Loan</span>
                    <span className="text-sm font-bold text-amber-700 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                      {row.goldLoan}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Personal Loan</span>
                    <span className="text-sm text-gray-700">{row.personal}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Credit Card</span>
                    <span className="text-sm text-gray-700">{row.credit}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-xs text-gray-600">Property Loan</span>
                    <span className="text-sm text-gray-700">{row.property}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Enhanced Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-full">
              <thead>
                <tr className="bg-linear-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-bold text-gray-900 text-sm">Feature</th>
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
                    <td className="py-3 px-4 text-center bg-linear-to-r from-amber-50 to-amber-100">
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
          <div className="mt-4 p-3 bg-linear-to-r from-blue-50 to-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-gray-700 text-center">
              <span className="font-bold text-amber-700">Bottom Line:</span> Gold loans are 
              <span className="font-semibold text-gray-900"> faster, cheaper, and easier</span> to get than other loan options.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}