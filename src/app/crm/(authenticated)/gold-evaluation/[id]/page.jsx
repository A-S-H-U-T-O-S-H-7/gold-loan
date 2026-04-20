'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

// Components
import GoldEvaluationForm from '@/components/crm/gold-evaluation/GoldEvaluationForm';
import GoldItemsList from '@/components/crm/gold-evaluation/GoldItemsList';
import GoldItemForm from '@/components/crm/gold-evaluation/GoldItemForm';
import GoldValuationCard from '@/components/crm/gold-evaluation/GoldValuationCard';
import LoanOfferCard from '@/components/crm/gold-evaluation/LoanOfferCard';

// Services
import { goldEvaluationService } from '@/lib/services/GoldEvaluationServices';

const GoldEvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";
  const applicationId = params.id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [goldItems, setGoldItems] = useState([]);
  const [customerDetails, setCustomerDetails] = useState(null);
  const [goldRate, setGoldRate] = useState(5200);
  const [ltvPercentage, setLtvPercentage] = useState(75);

  useEffect(() => {
    fetchCustomerDetails();
    fetchGoldRate();
    fetchExistingEvaluation();
  }, [applicationId]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const response = await goldEvaluationService.getCustomerDetails(applicationId);
      if (response.success) {
        setCustomerDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGoldRate = async () => {
    try {
      const response = await goldEvaluationService.getGoldRate();
      if (response.success) {
        setGoldRate(response.rate);
      }
    } catch (error) {
      console.error('Error fetching gold rate:', error);
    }
  };

  const fetchExistingEvaluation = async () => {
    try {
      const response = await goldEvaluationService.getEvaluation(applicationId);
      if (response.success && response.data?.gold_items) {
        setGoldItems(response.data.gold_items);
      }
    } catch (error) {
      console.error('No existing evaluation:', error);
    }
  };

  const calculateTotals = () => {
    let totalGrossWeight = 0;
    let totalNetWeight = 0;
    let totalStoneWeight = 0;

    goldItems.forEach(item => {
      totalGrossWeight += parseFloat(item.grossWeight) || 0;
      totalNetWeight += parseFloat(item.netWeight) || 0;
      totalStoneWeight += parseFloat(item.stoneWeight) || 0;
    });

    const eligibleAmount = (totalNetWeight * goldRate * ltvPercentage) / 100;

    return {
      totalGrossWeight: totalGrossWeight.toFixed(2),
      totalNetWeight: totalNetWeight.toFixed(2),
      totalStoneWeight: totalStoneWeight.toFixed(2),
      eligibleAmount: eligibleAmount.toFixed(2),
      itemCount: goldItems.length
    };
  };

  const totals = calculateTotals();

  const handleAddItem = (newItem) => {
    setGoldItems([...goldItems, { ...newItem, id: Date.now() }]);
    setShowAddItem(false);
    toast.success('Gold item added successfully');
  };

  const handleRemoveItem = (itemId) => {
    setGoldItems(goldItems.filter(item => item.id !== itemId));
    toast.success('Gold item removed');
  };

  const handleUpdateItem = (updatedItem) => {
    setGoldItems(goldItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    toast.success('Gold item updated');
  };

  const handleSubmitEvaluation = async () => {
    if (goldItems.length === 0) {
      toast.error('Please add at least one gold item');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        application_id: applicationId,
        gold_items: goldItems,
        gold_rate: goldRate,
        ltv_percentage: ltvPercentage,
        ...totals
      };

      const response = await goldEvaluationService.saveEvaluation(payload);
      if (response.success) {
        toast.success('Gold evaluation completed successfully');
      }
    } catch (error) {
      toast.error(error?.message || 'Failed to save evaluation');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-crm-accent-soft/60'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-crm-primary mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>Loading evaluation data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-crm-accent-soft/60'}`}>
      <div className="p-4 md:p-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
               <button
                                       onClick={() => router.back()}
                                       className={`p-2.5 sm:p-3 cursor-pointer rounded-lg sm:rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                                         isDark
                                           ? "hover:bg-gray-800 bg-gray-800/50 border border-crm-border"
                                           : "hover:bg-crm-accent-soft bg-crm-accent-soft border border-crm-border"
                                       }`}
                                     >
                             <ArrowLeft className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              isDark ? "text-crm-primary-strong" : "text-crm-primary-strong"
                             }`} />
                           </button>
                <div>
                  <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                    isDark ? 'from-crm-gradient-from to-crm-gradient-to' : 'from-crm-gradient-from to-crm-gradient-to'
                  } bg-clip-text text-transparent`}>
                    Gold Evaluation
                  </h1>
                  {customerDetails && (
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Customer: {customerDetails.fullname} | CRN: {customerDetails.crnno}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <GoldEvaluationForm
            customerDetails={customerDetails}
            isDark={isDark}
          />

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Left Column - Gold Items */}
            <div className="lg:col-span-2 space-y-6">
              {!showAddItem ? (
                <div className={`rounded-xl shadow-lg border-2 overflow-hidden ${
                  isDark ? "bg-gray-800 border-crm-border shadow-crm-soft" : "bg-white border-crm-border shadow-crm-soft"
                }`}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-crm-primary-strong' : 'bg-crm-primary'}`}></div>
                        <h3 className={`text-lg font-semibold ${isDark ? "text-crm-primary-strong" : "text-crm-primary"}`}>
                          Gold Items ({goldItems.length})
                        </h3>
                      </div>
                      <button
                        onClick={() => setShowAddItem(true)}
                        className="px-3 py-1.5 text-sm bg-crm-primary text-white rounded-lg hover:bg-crm-primary-strong transition-all duration-200 flex items-center gap-1"
                      >
                        + Add Item
                      </button>
                    </div>

                    <GoldItemsList
                      items={goldItems}
                      onRemove={handleRemoveItem}
                      onUpdate={handleUpdateItem}
                      isDark={isDark}
                    />
                  </div>
                </div>
              ) : (
                <GoldItemForm
                  onSubmit={handleAddItem}
                  onCancel={() => setShowAddItem(false)}
                  isDark={isDark}
                />
              )}
            </div>

            {/* Right Column - Valuation & Offer */}
            <div className="space-y-6">
              <GoldValuationCard
                totals={totals}
                goldRate={goldRate}
                ltvPercentage={ltvPercentage}
                onGoldRateChange={setGoldRate}
                onLtvChange={setLtvPercentage}
                isDark={isDark}
              />

              <LoanOfferCard
                eligibleAmount={totals.eligibleAmount}
                onSubmit={handleSubmitEvaluation}
                saving={saving}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoldEvaluationPage;