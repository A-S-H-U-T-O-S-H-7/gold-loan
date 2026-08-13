export const PERMISSION_KEYS = [
  'dashboard',
  'manage_loans',
  'transaction',
  'disbursement',
  'credit_approval',
  'loan_offer',
  'gold_evaluation',
  'follow_up',
  'create_customer',
  'rejected_applications',
  'active_loans',
  'overdue_loans',
  'closed_loans',
  'collect_payment',
  'payment_history',
  'vault_management',
  'gold_release',
  'gold_rate_settings',
  'branch_reports',
  'disbursement_reports',
  'npa_reports',
  'audit_logs',
  'branch_management',
  'user_roles',
  'system_config',
  'user_management',
  'client_history',
];

export const ALL_PERMISSIONS = PERMISSION_KEYS.reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {});

export const BRANCHES = [
  { id: 1, name: 'MG Road', city: 'Bengaluru', code: 'BLR-001', status: 'Active' },
  { id: 2, name: 'Andheri West', city: 'Mumbai', code: 'MUM-002', status: 'Active' },
  { id: 3, name: 'Koramangala', city: 'Bengaluru', code: 'BLR-003', status: 'Active' },
  { id: 4, name: 'T Nagar', city: 'Chennai', code: 'CHN-004', status: 'Inactive' },
];

export const STATUSES = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER_REVIEW',
  KYC_VERIFIED: 'KYC_VERIFIED',
  FOLLOW_UP: 'FOLLOW_UP',
  REJECTED: 'REJECTED',
  PENDING_EVALUATION: 'PENDING_EVALUATION',
  GOLD_EVALUATED: 'GOLD_EVALUATED',
  OFFER_PENDING: 'OFFER_PENDING',
  OFFER_ACCEPTED: 'OFFER_ACCEPTED',
  OFFER_REJECTED: 'OFFER_REJECTED',
  NEEDS_REVIEW: 'NEEDS_REVIEW',
  APPROVED: 'APPROVED',
  READY_FOR_TRANSFER: 'READY_FOR_TRANSFER',
  TRANSFERRED: 'TRANSFERRED',
  FAILED: 'FAILED',
  ACTIVE: 'ACTIVE',
  OVERDUE: 'OVERDUE',
  NPA: 'NPA',
  CLOSED: 'CLOSED',
};

export const STATUS_META = {
  DRAFT: { label: 'Draft', tone: 'muted' },
  PENDING: { label: 'Pending', tone: 'warning' },
  UNDER_REVIEW: { label: 'Under Review', tone: 'info' },
  KYC_VERIFIED: { label: 'KYC Verified', tone: 'success' },
  FOLLOW_UP: { label: 'Follow-Up', tone: 'warning' },
  REJECTED: { label: 'Rejected', tone: 'danger' },
  PENDING_EVALUATION: { label: 'Pending Evaluation', tone: 'warning' },
  GOLD_EVALUATED: { label: 'Gold Evaluated', tone: 'success' },
  OFFER_PENDING: { label: 'Offer Pending', tone: 'warning' },
  OFFER_ACCEPTED: { label: 'Offer Accepted', tone: 'success' },
  OFFER_REJECTED: { label: 'Offer Rejected', tone: 'danger' },
  NEEDS_REVIEW: { label: 'Needs Review', tone: 'warning' },
  APPROVED: { label: 'Approved', tone: 'success' },
  READY_FOR_TRANSFER: { label: 'Ready for Transfer', tone: 'info' },
  TRANSFERRED: { label: 'Transferred', tone: 'success' },
  FAILED: { label: 'Failed', tone: 'danger' },
  ACTIVE: { label: 'Active', tone: 'success' },
  OVERDUE: { label: 'Overdue', tone: 'danger' },
  NPA: { label: 'NPA', tone: 'danger' },
  CLOSED: { label: 'Closed', tone: 'muted' },
};

export const GOLD_TYPES = ['Jewelry', 'Coin', 'Bar', 'Biscuit'];
export const GOLD_ITEM_NAMES = ['Necklace', 'Bangle', 'Chain', 'Ring', 'Earring', 'Coin', 'Bar', 'Pendant', 'Other'];
export const PURITIES = ['24K', '22K', '18K'];
export const TENURES = [3, 6, 12];
export const REPAYMENT_TYPES = ['Bullet', 'Monthly Interest', 'EMI'];
export const PAYMENT_TYPES = ['EMI', 'Interest', 'Partial', 'Full', 'Foreclosure'];
export const PAYMENT_MODES = ['Bank Transfer', 'UPI', 'Cash', 'Cheque'];
export const DISBURSE_MODES = ['Bank Transfer', 'UPI', 'Cash'];
export const KYC_STATUSES = ['PENDING', 'UNDER_REVIEW', 'FOLLOW_UP', 'KYC_VERIFIED', 'REJECTED'];
export const TXN_STATUSES = ['PENDING', 'SUCCESS', 'FAILED'];

export const DEFAULT_GOLD_RATES = { '24K': 6850, '22K': 6280, '18K': 5140 };
export const DEFAULT_LTV = 75;
export const DEFAULT_INTEREST_RATE = 12;
export const DEFAULT_PROCESSING_FEE = 1.5;
export const NPA_DAYS = 90;
export const DEFAULT_GRACE_DAYS = 7;
export const DEFAULT_PENALTY_RATE = 2;

export const LEAD_QUEUE = ['DRAFT', 'PENDING', 'UNDER_REVIEW'];
export const FOLLOWUP_QUEUE = ['FOLLOW_UP'];
export const GOLD_QUEUE = ['KYC_VERIFIED', 'PENDING_EVALUATION', 'NEEDS_REVIEW'];
export const OFFER_QUEUE = ['GOLD_EVALUATED', 'OFFER_PENDING'];
export const CREDIT_QUEUE = ['OFFER_ACCEPTED'];
export const DISBURSE_QUEUE = ['APPROVED', 'FAILED'];
export const BOOK_STATUSES = ['ACTIVE', 'OVERDUE', 'NPA', 'CLOSED'];
