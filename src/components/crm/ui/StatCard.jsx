'use client';

export default function StatCard({ label, value, hint, icon: Icon, tone = 'gold' }) {
  const tones = {
    gold: 'bg-primary-surface text-primary',
    success: 'bg-success-light text-success',
    danger: 'bg-danger-light text-danger',
    info: 'bg-info-light text-info',
    warning: 'bg-warning-light text-warning',
  };

  return (
    <div className="card p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-foreground-muted font-semibold">{label}</p>
          <p className="mt-2 text-2xl font-mono font-semibold text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-foreground-muted">{hint}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
