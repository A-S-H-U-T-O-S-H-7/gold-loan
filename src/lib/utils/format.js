export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export const formatNumber = (value = 0, digits = 2) =>
  new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);

export const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (value) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const daysBetween = (from, to = new Date()) => {
  if (!from) return 0;
  const start = new Date(from);
  const end = new Date(to);
  return Math.max(0, Math.floor((end - start) / (1000 * 60 * 60 * 24)));
};

export const daysAgoIso = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

export const daysFromNowIso = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

export const nextId = (prefix, items, key = 'id') => {
  const max = items.reduce((acc, item) => {
    const match = String(item[key] || '').match(/(\d+)$/);
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

export const calculateEmi = (principal, annualRate, tenureMonths) => {
  const p = Number(principal) || 0;
  const n = Number(tenureMonths) || 0;
  const r = (Number(annualRate) || 0) / 12 / 100;
  if (!p || !n) return 0;
  if (!r) return p / n;
  const pow = Math.pow(1 + r, n);
  return Math.round((p * r * pow) / (pow - 1));
};

export const calculateValuation = ({ netWeight, purity, goldRates, ltv }) => {
  const rate = goldRates?.[purity] || 0;
  const value = (Number(netWeight) || 0) * rate;
  const loanAmount = Math.round(value * ((Number(ltv) || 0) / 100));
  return { rate, value: Math.round(value), loanAmount };
};

export const calculatePayable = ({ amount, rate, tenure, repaymentType }) => {
  const principal = Number(amount) || 0;
  const annual = Number(rate) || 0;
  const months = Number(tenure) || 0;
  const interest = Math.round((principal * annual * months) / 12 / 100);

  if (repaymentType === 'EMI') {
    const emi = calculateEmi(principal, annual, months);
    return { emi, totalPayable: emi * months, interest: emi * months - principal };
  }

  if (repaymentType === 'Monthly Interest') {
    const monthlyInterest = Math.round(interest / months) || 0;
    return { emi: monthlyInterest, totalPayable: principal + interest, interest };
  }

  return { emi: 0, totalPayable: principal + interest, interest };
};

export const maskAadhaar = (value = '') => {
  const digits = String(value).replace(/\D/g, '');
  if (digits.length < 4) return value || '—';
  return `XXXX-XXXX-${digits.slice(-4)}`;
};

export const getBranchName = (branchId, branches = []) =>
  branches.find((b) => b.id === Number(branchId))?.name || `Branch #${branchId || '—'}`;
