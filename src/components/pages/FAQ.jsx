"use client"

import { useState } from "react";
import Image from "next/image";
import { FaAngleDown, FaGem, FaCalculator, FaUserCheck, FaWeight, FaFileSignature, FaHistory, FaCoins } from "react-icons/fa";
import { MdSecurity, MdPayment, MdTimer, MdHelp } from "react-icons/md";

export default function FAQs() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const faqCategories = [
    { id: "all", label: "All Questions", icon: <MdHelp />, count: 21 },
    { id: "application", label: "Application", icon: <FaUserCheck />, count: 6 },
    { id: "valuation", label: "Gold Valuation", icon: <FaGem />, count: 4 },
    { id: "loan", label: "Loan Details", icon: <FaCalculator />, count: 5 },
    { id: "repayment", label: "Repayment", icon: <MdPayment />, count: 4 },
    { id: "security", label: "Security", icon: <MdSecurity />, count: 2 },
  ];

  const faqData = [
    // Application Process
    {
      id: 1,
      category: "application",
      question: "How can I apply for a gold loan?",
      answer: "You can apply through multiple convenient options:\n\n• Walk into any of our branches\n• Fill our online pre-application form\n• Through referrals from existing customers\n• Contact our customer care for assistance"
    },
    {
      id: 2,
      category: "application",
      question: "What documents are required for gold loan application?",
      answer: "Required documents include:\n\n• Aadhaar Card (with mobile number linked)\n• PAN Card\n• Address Proof (if different from Aadhaar)\n• Bank Account Details\n• Live photo capture during application\n• Gold items for valuation"
    },
    {
      id: 3,
      category: "application",
      question: "Can I apply for gold loan online?",
      answer: "Yes! You can start your application online through our website or mobile app. After filling the initial details, you'll need to visit the branch for gold evaluation and final documentation. We also offer branch locator to find the nearest branch."
    },
    {
      id: 4,
      category: "application",
      question: "How long does the approval process take?",
      answer: "Our gold loan process is quick and efficient:\n\n• KYC verification: 15-30 minutes\n• Gold evaluation: 20-30 minutes\n• Loan approval: Instant after valuation\n• Disbursement: Within 30 minutes of document completion"
    },
    {
      id: 5,
      category: "application",
      question: "What types of gold items are accepted?",
      answer: "We accept various gold items including:\n\n• Gold jewellery (chains, rings, bangles)\n• Gold coins\n• Gold biscuits/bars\n• Mixed purity items (will be tested separately)\n\nNote: Stones in jewellery are evaluated separately and deducted from weight."
    },

    // Gold Valuation
    {
      id: 6,
      category: "valuation",
      question: "How is my gold valued?",
      answer: "Gold valuation follows this transparent process:\n\n1. Physical verification by certified appraisers\n2. Purity testing using advanced equipment\n3. Weight measurement using calibrated scales\n4. Stone weight deduction (if applicable)\n5. Current gold rate application\n6. LTV percentage calculation\n\nThe complete process is done in front of you with full transparency."
    },
    {
      id: 7,
      category: "valuation",
      question: "What is LTV (Loan-to-Value) percentage?",
      answer: "LTV is the percentage of your gold's value that you can borrow. For example:\n\n• If your gold is valued at ₹1,00,000\n• With 75% LTV\n• Maximum loan amount = ₹75,000\n\nLTV varies based on gold purity and regulatory guidelines."
    },
    {
      id: 8,
      category: "valuation",
      question: "What purity of gold is accepted?",
      answer: "We accept gold of various purity levels:\n\n• 24K (99.9% pure) - Highest LTV\n• 22K (91.6% pure) - Standard jewellery\n• 18K and below - Evaluated separately\n• Mixed purity items - Tested and valued separately"
    },
    {
      id: 9,
      category: "valuation",
      question: "Are stones in jewellery considered for valuation?",
      answer: "Stones in gold jewellery are carefully evaluated:\n\n• Stone weight is deducted from total weight\n• Only pure gold weight is considered\n• Precious stones may have separate valuation\n• Artificial stones have no additional value\n\nYou'll receive detailed appraisal remarks."
    },

    // Loan Details
    {
      id: 10,
      category: "loan",
      question: "What is the minimum and maximum loan amount?",
      answer: "Our gold loan amounts are flexible:\n\n• Minimum loan: Starting from ₹1,500\n• Maximum loan: Up to several lakhs based on gold value\n• No upper limit - depends on gold valuation\n• Higher amounts for higher purity gold"
    },
    {
      id: 11,
      category: "loan",
      question: "What are the interest rates?",
      answer: "We offer competitive interest rates:\n\n• Starting from 0.75% per month\n• Rates vary based on loan amount and tenure\n• No hidden charges\n• Simple interest calculation\n• Special rates for senior citizens"
    },
    {
      id: 12,
      category: "loan",
      question: "What tenure options are available?",
      answer: "Flexible tenure options:\n\n• Short-term: 3 months\n• Medium-term: 6 months\n• Long-term: 12 months\n• Renewal options available\n• Early closure facility"
    },
    {
      id: 13,
      category: "loan",
      question: "Are there any processing fees?",
      answer: "Yes, we charge minimal processing fees:\n\n• 1-2% of loan amount (varies by loan size)\n• No advance EMIs\n• Transparent fee structure\n• All charges mentioned in loan agreement"
    },
    {
      id: 14,
      category: "loan",
      question: "How is the loan amount disbursed?",
      answer: "Multiple disbursement options:\n\n• Instant bank transfer\n• UPI payment\n• Cash (within regulatory limits)\n• Immediate disbursement after approval\n• Direct to your bank account"
    },

    // Repayment
    {
      id: 15,
      category: "repayment",
      question: "What repayment options are available?",
      answer: "Flexible repayment methods:\n\n• Monthly interest payment\n• Bullet repayment (one-time at end)\n• EMI options\n• Partial prepayment allowed\n• Multiple payment modes: UPI, Cash, Bank Transfer"
    },
    {
      id: 16,
      category: "repayment",
      question: "Can I repay the loan early?",
      answer: "Yes, early repayment features:\n\n• No prepayment penalty\n• Interest calculated only for actual period\n• Instant gold release after payment\n• Online foreclosure facility\n• Partial payment acceptance"
    },
    {
      id: 17,
      category: "repayment",
      question: "What happens if I miss a payment?",
      answer: "Our process for overdue payments:\n\n• 15-day grace period\n• Regular SMS/email reminders\n• Nominal penalty charges\n• Support for payment restructuring\n• Personal assistance to avoid NPA status"
    },
    {
      id: 18,
      category: "repayment",
      question: "How do I get my gold back after repayment?",
      answer: "Gold release process:\n\n1. Complete final payment\n2. Receive OTP verification\n3. Visit branch for gold collection\n4. Verify gold items\n5. Sign gold release acknowledgement\n6. Gold returned in sealed packet"
    },

    // Security
    {
      id: 19,
      category: "security",
      question: "How is my gold secured?",
      answer: "Your gold is protected with:\n\n• Bank-grade vault security\n• 24/7 CCTV surveillance\n• Insurance coverage\n• Digital locker mapping\n• Regular audit trails\n• Temperature and humidity control"
    },
    {
      id: 20,
      category: "security",
      question: "What happens in case of default?",
      answer: "Default handling process:\n\n• Regular communication attempts\n• Legal notice after 90 days overdue\n• Auction process as per RBI guidelines\n• Surplus amount returned to customer\n• Transparent auction settlement"
    },
    {
  id: 21,
  category: "application",
  question: "Are gold loan terms subject to change?",
  answer: "Yes. Interest rates, LTV, fees, and policies are subject to change based on RBI guidelines, gold market conditions, and company policies. Final terms will be confirmed at the branch during loan sanction."
}

  ];

  const filteredFaqs = activeCategory === "all" 
    ? faqData 
    : faqData.filter(faq => faq.category === activeCategory);

  const toggle = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-linear-to-b pt-6 from-amber-50 to-white text-gray-800">
      {/* Hero Section */}
      <div className="relative mx-4  md:mx-10 overflow-hidden rounded-2xl bg-linear-to-r from-amber-600 to-amber-800 shadow-xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative p-8 md:p-12 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <FaGem className="text-3xl" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Gold Loan FAQs</h1>
              <p className="text-amber-100 mt-2">Quick answers to your questions about gold loans</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <FaCalculator />
                <span className="font-semibold">Gold Calculator</span>
              </div>
              <p className="text-sm mt-1 text-amber-100">Estimate your loan amount</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MdTimer />
                <span className="font-semibold">Quick Process</span>
              </div>
              <p className="text-sm mt-1 text-amber-100">Same-day disbursement</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <MdSecurity />
                <span className="font-semibold">Safe Storage</span>
              </div>
              <p className="text-sm mt-1 text-amber-100">Bank-grade security</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <FaCoins />
                <span className="font-semibold">Flexible Repayment</span>
              </div>
              <p className="text-sm mt-1 text-amber-100">Multiple options available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="px-4 md:px-10 py-12 max-w-7xl mx-auto">
        {/* Category Filter */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-full transition-all ${
                  activeCategory === cat.id
                    ? "bg-amber-500 text-white shadow-lg"
                    : "bg-white text-gray-700 border border-amber-200 hover:bg-amber-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="font-medium">{cat.label}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  activeCategory === cat.id
                    ? "bg-white/30"
                    : "bg-amber-100"
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          {filteredFaqs.map((item, index) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-amber-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-amber-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-lg mt-1">
                    {item.category === "application" && <FaUserCheck className="text-amber-600" />}
                    {item.category === "valuation" && <FaGem className="text-amber-600" />}
                    {item.category === "loan" && <FaCalculator className="text-amber-600" />}
                    {item.category === "repayment" && <MdPayment className="text-amber-600" />}
                    {item.category === "security" && <MdSecurity className="text-amber-600" />}
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                      {item.question}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to {activeIndex === item.id ? "collapse" : "expand"} answer
                    </p>
                  </div>
                </div>
                <FaAngleDown
                  className={`min-w-[20px] min-h-[20px] text-xl text-amber-500 transition-transform duration-300 ${
                    activeIndex === item.id ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              {activeIndex === item.id && (
                <div className="px-6 pb-6 border-t border-amber-100">
                  <div className="pt-4 text-gray-700 whitespace-pre-line leading-relaxed">
                    {item.answer.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 flex items-start">
                        {line.startsWith('•') && (
                          <span className="text-amber-500 mr-2 mt-1">•</span>
                        )}
                        <span>{line}</span>
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <p className="text-sm text-amber-600 font-medium">
                      Need more details? Visit our{" "}
                      <a href="/contact" className="underline hover:text-amber-800">
                        Contact Page
                      </a>{" "}
                      or call our customer care
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-linear-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Still have questions?</h3>
              <p className="text-gray-600 mt-2">Our customer support team is here to help you 24/7</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors">
                Chat with Support
              </button>
              <button className="px-6 py-3 bg-white text-amber-600 border border-amber-300 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                Call Now
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}