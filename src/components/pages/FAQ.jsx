'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, BookOpen, Shield, DollarSign, Home, Clock } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqCategories = [
    {
      id: 'general',
      name: 'General Questions',
      icon: HelpCircle,
      color: 'bg-blue-100 text-blue-600',
      questions: [
        {
          q: 'What is a gold loan?',
          a: 'A gold loan is a secured loan where you pledge your gold jewelry, coins, or biscuits as collateral. You receive cash instantly while your gold is safely stored in our vaults. You get your gold back upon full repayment.'
        },
        {
          q: 'How does gold loan work?',
          a: '1. Bring your gold to our branch\n2. Get it evaluated by experts\n3. Receive loan amount instantly\n4. Pay interest monthly\n5. Get gold back after repayment\nIt\'s that simple!'
        },
        {
          q: 'Is my gold safe with you?',
          a: 'Yes! Your gold is stored in bank-grade vaults with 24/7 CCTV surveillance, armed guards, and insurance coverage. We provide a detailed pledge receipt with all details.'
        },
        {
          q: 'Can I get my gold back anytime?',
          a: 'Yes, you can reclaim your gold anytime by repaying the principal and accrued interest. No lock-in period after minimum tenure.'
        }
      ]
    },
    {
      id: 'eligibility',
      name: 'Eligibility & Documents',
      icon: BookOpen,
      color: 'bg-green-100 text-green-600',
      questions: [
        {
          q: 'What are the eligibility criteria?',
          a: 'Minimum age: 18 years\nMaximum age: 75 years\nIndian resident\nValid ID proof\nHallmarked gold (22K/24K)\nNo income proof required'
        },
        {
          q: 'What documents are required?',
          a: 'Mandatory: Aadhaar Card\nFor loans above ₹5 lakh: PAN Card\nAddress proof if different from Aadhaar\nTwo passport-size photographs'
        },
        {
          q: 'Do you check CIBIL score?',
          a: 'No, we do not check CIBIL score for gold loans. Your gold is the only security we need.'
        },
        {
          q: 'Can NRIs apply for gold loan?',
          a: 'Currently, we only offer gold loans to Indian residents. NRIs can apply through their family members who are residents.'
        }
      ]
    },
    {
      id: 'valuation',
      name: 'Gold Valuation',
      icon: Shield,
      color: 'bg-amber-100 text-amber-600',
      questions: [
        {
          q: 'How is gold value calculated?',
          a: 'Gold value = Weight (grams) × Purity (%) × Current gold rate per gram\nExample: 100g 22K gold at ₹6,000/g = 100 × 0.916 × 6000 = ₹5,49,600'
        },
        {
          q: 'What purity of gold do you accept?',
          a: 'We accept 22K and 24K hallmarked gold jewelry, coins, and biscuits. Gold must be free of stones, gems, or other materials.'
        },
        {
          q: 'Do you accept gold coins?',
          a: 'Yes, we accept gold coins from RBI-approved banks and government mints with proper certification.'
        },
        {
          q: 'What if my gold has stones?',
          a: 'We only accept pure gold items. Stones are removed (deducted from weight) before valuation, or you can remove them yourself before coming.'
        }
      ]
    },
    {
      id: 'loan',
      name: 'Loan Details',
      icon: DollarSign,
      color: 'bg-purple-100 text-purple-600',
      questions: [
        {
          q: 'What is the interest rate?',
          a: 'Interest rates start from 0.79% per month (9.48% per annum) and go up to 1.25% per month (15% per annum) depending on loan amount and tenure.'
        },
        {
          q: 'What is the maximum loan amount?',
          a: 'You can get up to 75% of your gold value as loan. For example, if your gold is worth ₹10 lakh, you can get up to ₹7.5 lakh as loan.'
        },
        {
          q: 'What is the minimum and maximum tenure?',
          a: 'Minimum: 3 months\nMaximum: 36 months (3 years)\nYou can choose any tenure between these limits.'
        },
        {
          q: 'Are there any hidden charges?',
          a: 'No hidden charges. Only processing fee (0-1%) and GST on interest. All charges are disclosed upfront before you accept the loan.'
        }
      ]
    },
    {
      id: 'process',
      name: 'Process & Timeline',
      icon: Clock,
      color: 'bg-red-100 text-red-600',
      questions: [
        {
          q: 'How long does it take to get loan?',
          a: 'Total time from entry to cash disbursal: 45-60 minutes\nValuation: 15-20 minutes\nDocumentation: 10-15 minutes\nApproval & disbursal: 5-10 minutes'
        },
        {
          q: 'Can I apply online?',
          a: 'Yes! You can start your application online to get pre-approval. Then visit branch with gold for final processing and disbursal.'
        },
        {
          q: 'What happens if I miss EMI payment?',
          a: 'We provide 15-day grace period. After that, penalty charges apply. In case of prolonged default, we may auction the gold after due process.'
        },
        {
          q: 'How to renew gold loan?',
          a: 'Simply pay the accrued interest before due date, and your loan gets renewed automatically for same tenure.'
        }
      ]
    },
    {
      id: 'repayment',
      name: 'Repayment & Closure',
      icon: Home,
      color: 'bg-cyan-100 text-cyan-600',
      questions: [
        {
          q: 'How to repay the loan?',
          a: 'Multiple options: Cash at branch, online transfer, UPI, cheque, or auto-debit from bank account. Monthly reminders sent via SMS/WhatsApp.'
        },
        {
          q: 'Can I repay early?',
          a: 'Yes! You can repay anytime. No prepayment charges after 6 months. Before 6 months, nominal charges may apply.'
        },
        {
          q: 'How to get gold back after repayment?',
          a: '1. Make full payment\n2. Get release order\n3. Visit branch with ID proof\n4. Collect gold after verification\n5. Sign acknowledgment receipt'
        },
        {
          q: 'What if I lose pledge receipt?',
          a: 'Contact branch immediately. We will verify your identity through KYC and issue duplicate receipt after verification.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about gold loans. Can't find what you're looking for? 
            Contact our support team.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search questions (e.g., interest rate, documents, tenure)"
              className="w-full px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm"
            />
            <button className="absolute right-3 top-3 bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, categoryIndex) => (
            <div key={category.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Category Header */}
              <div className="flex items-center p-6 bg-gray-50 border-b">
                <div className={`p-3 rounded-lg ${category.color} mr-4`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
                <span className="ml-auto px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                  {category.questions.length} questions
                </span>
              </div>

              {/* Questions */}
              <div className="divide-y divide-gray-100">
                {category.questions.map((item, questionIndex) => {
                  const index = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div key={questionIndex} className="p-6">
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <div className="flex items-start">
                          <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="font-bold">Q</span>
                          </div>
                          <span className="text-lg font-semibold text-gray-900 pr-4">
                            {item.q}
                          </span>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="mt-4 ml-12">
                          <div className="flex">
                            <div className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                              <span className="font-bold">A</span>
                            </div>
                            <div className="text-gray-600 whitespace-pre-line">
                              {item.a}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="opacity-90 mb-6 max-w-2xl mx-auto">
            Our customer support team is available 24/7 to answer your queries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition">
              📞 Call Now: 1800-123-4567
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
              💬 Chat on WhatsApp
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
              📧 Email Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}