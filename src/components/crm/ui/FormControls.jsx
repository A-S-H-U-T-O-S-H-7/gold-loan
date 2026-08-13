'use client';

export function PrimaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`h-10 px-4 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-50 inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`h-10 px-4 rounded-xl border border-border bg-surface text-sm font-medium text-foreground hover:bg-surface-hover inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`h-10 px-4 rounded-xl bg-danger text-white text-sm font-semibold hover:opacity-90 inline-flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({ label, children, error }) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm font-medium text-foreground-secondary mb-1.5">{label}</span>
      )}
      {children}
      {error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );
}

export const inputClass =
  'w-full h-11 px-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary placeholder:text-foreground-muted';
