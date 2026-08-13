import { daysBetween } from '@/lib/utils/format';
import { DEFAULT_GRACE_DAYS, DEFAULT_PENALTY_RATE, NPA_DAYS } from '@/lib/constants/crm';

export function emptyGoldItem() {
  return {
    id: `GI-${Date.now()}-${Math.floor(Math.random() * 99)}`,
    name: 'Necklace',
    carat: '22K',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    photo: '',
    remarks: '',
  };
}

export function totalsFromItems(items = []) {
  return items.reduce(
    (acc, item) => {
      const gross = Number(item.grossWeight) || 0;
      const stone = Number(item.stoneWeight) || 0;
      const net = Number(item.netWeight) || Math.max(0, gross - stone);
      acc.grossWeight += gross;
      acc.stoneWeight += stone;
      acc.netWeight += net;
      return acc;
    },
    { grossWeight: 0, stoneWeight: 0, netWeight: 0 }
  );
}

export function valueFromItems(items = [], goldRates = {}) {
  return items.reduce((sum, item) => {
    const net = Number(item.netWeight) || Math.max(0, (Number(item.grossWeight) || 0) - (Number(item.stoneWeight) || 0));
    const rate = goldRates[item.carat] || goldRates['22K'] || 0;
    return sum + net * rate;
  }, 0);
}

export function freezeValuation(items, goldRates, ltv) {
  const totals = totalsFromItems(items);
  const goldValue = Math.round(valueFromItems(items, goldRates));
  const eligibleAmount = Math.round(goldValue * ((Number(ltv) || 0) / 100));
  return {
    items: items.map((item) => ({
      ...item,
      netWeight: Number(item.netWeight) || Math.max(0, (Number(item.grossWeight) || 0) - (Number(item.stoneWeight) || 0)),
    })),
    ...totals,
    rateSnapshot: { ...goldRates },
    ltvSnapshot: Number(ltv) || 0,
    goldValue,
    eligibleAmount,
  };
}

export function eligibleOf(app) {
  return Number(app?.gold?.eligibleAmount || app?.loan?.eligibleAmount || 0);
}

export function offeredOf(app) {
  return Number(app?.loan?.offeredAmount || app?.loan?.amount || 0);
}

export function approvedOf(app) {
  return Number(app?.loan?.approvedAmount || offeredOf(app) || eligibleOf(app) || 0);
}

export function principalOf(app) {
  return approvedOf(app);
}

export function paidTotal(app) {
  return (app?.payments || []).reduce((sum, p) => sum + Number(p.amount || 0), 0);
}

export function paidPrincipal(app) {
  return (app?.payments || []).reduce((sum, p) => sum + Number(p.principal || 0), 0);
}

export function getServicing(app, config = {}) {
  const principal = principalOf(app);
  const outstandingPrincipal = Math.max(0, principal - paidPrincipal(app));
  const annual = Number(app.loan?.rate || config.interestRate || 12);
  const start = app.timeline?.transferredAt || app.timeline?.disbursedAt;
  const daysOpen = start ? daysBetween(start) : 0;
  const accruedInterest = Math.round((outstandingPrincipal * annual * daysOpen) / 365 / 100);

  const due = app.repaymentSchedule?.find((s) => s.status !== 'Paid')?.dueDate;
  const daysPastDue = due && new Date(due) < new Date() ? daysBetween(due) : 0;
  const graceDays = Number(config.graceDays ?? DEFAULT_GRACE_DAYS);
  const penaltyRate = Number(config.penaltyRate ?? DEFAULT_PENALTY_RATE);
  const npaDays = Number(config.npaDays ?? NPA_DAYS);
  const chargeableOverdue = Math.max(0, daysPastDue - graceDays);
  const penalty = chargeableOverdue > 0
    ? Math.round(outstandingPrincipal * (penaltyRate / 100) * (chargeableOverdue / 30))
    : 0;

  const alreadyPaid = paidTotal(app);
  const interestDue = Math.max(0, accruedInterest - (app.payments || []).reduce((s, p) => s + Number(p.interest || 0), 0));
  const penaltyDue = Math.max(0, penalty - (app.payments || []).reduce((s, p) => s + Number(p.penalty || 0), 0));
  const outstanding = outstandingPrincipal + interestDue + penaltyDue;

  let servicingStatus = app.status;
  if (['ACTIVE', 'OVERDUE', 'NPA'].includes(app.status)) {
    if (daysPastDue >= npaDays) servicingStatus = 'NPA';
    else if (chargeableOverdue > 0) servicingStatus = 'OVERDUE';
    else servicingStatus = 'ACTIVE';
  }

  return {
    principal,
    outstandingPrincipal,
    accruedInterest,
    interestDue,
    penalty,
    penaltyDue,
    outstanding,
    daysPastDue,
    chargeableOverdue,
    graceDays,
    nextDue: due || null,
    servicingStatus,
    alreadyPaid,
  };
}

export function allocatePayment(app, amount, config) {
  const snap = getServicing(app, config);
  let remaining = Number(amount) || 0;
  const interest = Math.min(remaining, snap.interestDue);
  remaining -= interest;
  const penalty = Math.min(remaining, snap.penaltyDue);
  remaining -= penalty;
  const principal = remaining;
  return { interest, penalty, principal, total: Number(amount) || 0 };
}
