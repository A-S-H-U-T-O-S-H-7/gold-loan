'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { useLoanStore } from '@/lib/store/loanStore';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { ArrowLeft } from 'lucide-react';
import StatusBadge from '@/components/crm/ui/StatusBadge';
import CustomerInfoCard from '@/components/crm/gold-evaluation/CustomerInfoCard';
import GoldItemsList from '@/components/crm/gold-evaluation/GoldItemsList';
import GoldValuationCard from '@/components/crm/gold-evaluation/GoldValuationCard';
import GoldItemForm from '@/components/crm/gold-evaluation/GoldItemForm';

export default function GoldEvaluationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const applicationId = params.id;

  const { applications, getApplication, updateApplication, setStatus } = useLoanStore();

  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState(null);
  const [goldItems, setGoldItems] = useState([]);
  const [goldRate, setGoldRate] = useState(8200);
  const [ltvPercentage, setLtvPercentage] = useState(75);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (applicationId) {
      const app = getApplication(applicationId);
      if (app) {
        setApplication(app);
        setGoldItems(app.gold?.items || []);
        setNotes(app.gold?.remarks || '');
        setGoldRate(app.gold?.goldRate || 8200);
        setLtvPercentage(app.gold?.ltvPercentage || 75);
      } else {
        toast.error('Application not found');
        router.push('/crm/gold-evaluation');
      }
    }
    setLoading(false);
  }, [applicationId, getApplication, router]);

  const calculateTotals = () => {
    let totalGrossWeight = 0;
    let totalNetWeight = 0;
    let totalStoneWeight = 0;

    goldItems.forEach(item => {
      totalGrossWeight += parseFloat(item.grossWeight) || 0;
      totalNetWeight += parseFloat(item.netWeight) || 0;
      totalStoneWeight += parseFloat(item.stoneWeight) || 0;
    });

    const goldValue = totalNetWeight * goldRate;
    const eligibleAmount = goldValue * (ltvPercentage / 100);

    return {
      itemCount: goldItems.length,
      totalGrossWeight: totalGrossWeight.toFixed(3),
      totalNetWeight: totalNetWeight.toFixed(3),
      totalStoneWeight: totalStoneWeight.toFixed(3),
      goldValue: goldValue,
      eligibleAmount: eligibleAmount,
    };
  };

  const totals = calculateTotals();

  const handleAddItem = (itemData) => {
    const newItem = {
      id: `item-${Date.now()}`,
      ...itemData,
      grossWeight: parseFloat(itemData.grossWeight),
      netWeight: parseFloat(itemData.netWeight),
      stoneWeight: parseFloat(itemData.stoneWeight) || 0,
    };
    setGoldItems([...goldItems, newItem]);
    setShowAddModal(false);
    toast.success('Gold item added successfully');
  };

  const handleRemoveItem = (itemId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This gold item will be removed permanently.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        setGoldItems(goldItems.filter(item => item.id !== itemId));
        toast.success('Item removed successfully');
      }
    });
  };

  const handleUpdateItem = (updatedItem) => {
    setGoldItems(goldItems.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const handleSubmitEvaluation = async (status) => {
  if (status !== 'REJECTED' && goldItems.length === 0) {
    toast.error('Please add at least one gold item');
    return;
  }

  // ============================================
  // REJECT - No gold items required
  // ============================================
  if (status === 'REJECTED') {
    const result = await Swal.fire({
      title: 'Reject Application?',
      text: 'Please provide a reason for rejection.',
      icon: 'warning',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonColor: '#C62828',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Reject!',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value || value.trim() === '') {
          return 'Please enter a rejection reason!';
        }
        return null;
      },
      background: isDark ? '#1a1a2e' : '#ffffff',
      color: isDark ? '#f3f4f6' : '#111827',
    });

    if (!result.isConfirmed) return;
    
    const rejectReason = result.value;
    setIsSubmitting(true);

    try {
      await setStatus(applicationId, 'REJECTED', { 
        rejectedReason: rejectReason, 
        rejectedStage: 'GOLD_EVALUATION' 
      });
      toast.success('Application rejected');
      router.push('/crm/rejected-applications');
    } catch (error) {
      toast.error('Failed to reject application');
    } finally {
      setIsSubmitting(false);
    }
    return;
  }

  // ============================================
  // GOLD_EVALUATED & PENDING_EVALUATION
  // ============================================
  setIsSubmitting(true);

  try {
    const goldData = {
      items: goldItems,
      goldRate: goldRate,
      ltvPercentage: ltvPercentage,
      remarks: notes,
      totals: totals,
    };

    await updateApplication(applicationId, { gold: goldData });

    if (status === 'GOLD_EVALUATED') {
      await setStatus(applicationId, 'GOLD_EVALUATED');
      toast.success('Gold evaluated successfully! Moving to Loan Offer');
      router.push('/crm/loan-offer');
    } else if (status === 'PENDING_EVALUATION') {
      await setStatus(applicationId, 'PENDING_EVALUATION');
      toast.success('Evaluation saved as pending');
    }
  } catch (error) {
    toast.error('Failed to submit evaluation');
  } finally {
    setIsSubmitting(false);
  }
};

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
        <div className="text-center">
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Application not found</p>
          <button
            onClick={() => router.push('/crm/gold-evaluation')}
            className="mt-4 px-4 py-2 bg-gold-500 text-white rounded hover:bg-gold-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const customer = application.customer || {};

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gold-50/30'}`}>
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => router.back()}
              className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 flex-shrink-0 ${
                isDark
                  ? "hover:bg-gray-800 bg-gray-800/50 border border-gold-600/30"
                  : "hover:bg-gold-50 bg-gold-50/50 border border-gold-200"
              }`}
            >
              <ArrowLeft className={`w-4 h-4 ${isDark ? "text-gold-400" : "text-gold-600"}`} />
            </button>
            <h1 className={`text-xl md:text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Gold Evaluation - {customer.name || application.id}
            </h1>
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Customer Info with KYC */}
        <CustomerInfoCard
          customerDetails={{
            ...customer,
            id: application.id,
            kycDate: application.timeline?.kycVerifiedAt,
            documents: customer.documents || {},
            nominee: customer.nominee || {},
            guarantor: customer.guarantor || {},
          }}
          isDark={isDark}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Left Column - Gold Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Gold Items ({goldItems.length})
              </h4>
              <button
                onClick={() => setShowAddModal(true)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all duration-200 hover:scale-105 cursor-pointer text-white ${
                  isDark
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
                }`}
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

            {/* Notes */}
            <div>
              <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Notes / Remarks
              </label>
              <textarea
                rows="2"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`w-full px-3 py-2 rounded border-2 transition-all duration-200 text-sm resize-none ${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-gold-400'
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-gold-500'
                } focus:ring-2 focus:ring-gold-500/20 focus:outline-none`}
                placeholder="Additional notes..."
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => handleSubmitEvaluation('PENDING_EVALUATION')}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded font-medium transition-all duration-200 cursor-pointer ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Save as Pending
              </button>
              <button
                onClick={() => handleSubmitEvaluation('REJECTED')}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded font-medium transition-all duration-200 cursor-pointer text-white ${
                  isDark
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Reject
              </button>
              <button
                onClick={() => handleSubmitEvaluation('GOLD_EVALUATED')}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded font-semibold transition-all duration-200 hover:scale-105 cursor-pointer text-white shadow-lg hover:shadow-xl ${
                  isDark
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500'
                    : 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Gold Evaluated'}
              </button>
            </div>
          </div>

          {/* Right Column - Valuation */}
          <div>
            <GoldValuationCard
              totals={totals}
              goldRate={goldRate}
              ltvPercentage={ltvPercentage}
              onGoldRateChange={setGoldRate}
              onLtvChange={setLtvPercentage}
              isDark={isDark}
            />
          </div>
        </div>

        {/* Add Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl">
              <GoldItemForm
                onSubmit={handleAddItem}
                onCancel={() => setShowAddModal(false)}
                isDark={isDark}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}