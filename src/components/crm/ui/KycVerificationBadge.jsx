export default function KycVerificationBadge({ verified }) {
  return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${verified
    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
    : 'border-amber-300 bg-amber-50 text-amber-700'}`}>
    {verified ? 'Verified' : 'Not Verified'}
  </span>;
}
