"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAdminAuthStore } from '@/lib/store/authAdminStore';

const WARNING_MS = 2 * 60 * 1000;
const MAX_HEARTBEAT_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart'];

function formatRemaining(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

// Keeps the CRM session alive while the admin is using the page, warns two
// minutes before it ends, and logs out when it does.
export default function SessionTimeoutGuard() {
  const { idleExpiresAt, sessionExpiresAt, lastRenewedAt, renewSession, logout, expireSession } = useAdminAuthStore();
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [dismissedLimit, setDismissedLimit] = useState(null);
  const lastActivity = useRef(Date.now());
  const ending = useRef(false);

  useEffect(() => {
    const markActive = () => { lastActivity.current = Date.now(); };
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, markActive, { passive: true, capture: true }));
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, markActive, { capture: true }));
      clearInterval(timer);
    };
  }, []);

  const deadline = idleExpiresAt && sessionExpiresAt ? Math.min(idleExpiresAt, sessionExpiresAt) : null;
  const remaining = deadline ? deadline - now : null;
  const atSessionLimit = deadline !== null && sessionExpiresAt <= idleExpiresAt;
  const warning = remaining !== null && remaining <= WARNING_MS;

  // A network failure leaves the session alone; the countdown still applies.
  const renew = () => renewSession().catch((error) => {
    if (error?.response?.status !== 401) throw error;
    ending.current = true;
    expireSession();
  });

  useEffect(() => {
    if (remaining === null || ending.current) return;
    if (remaining <= 0) {
      ending.current = true;
      expireSession();
      return;
    }
    // Activity only extends the session before the warning appears; after
    // that the admin must choose "Stay signed in".
    const heartbeatMs = Math.min(MAX_HEARTBEAT_MS, (idleExpiresAt - lastRenewedAt) / 3);
    if (!warning && !atSessionLimit && lastActivity.current > lastRenewedAt && now - lastRenewedAt >= heartbeatMs) {
      renew().catch(() => {});
    }
  }, [now]); // Runs once per one-second tick.

  const staySignedIn = async () => {
    setBusy(true);
    try {
      await renew();
    } catch {
      // Offline: the dialog stays open so the admin can try again.
    } finally {
      setBusy(false);
    }
  };

  if (!warning || remaining <= 0 || (atSessionLimit && dismissedLimit === sessionExpiresAt)) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="session-timeout-title"
        className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-foreground shadow-xl"
      >
        <div className="flex items-center gap-3">
          <Clock className="h-6 w-6 text-primary" />
          <h2 id="session-timeout-title" className="text-lg font-semibold">
            {atSessionLimit ? 'Session ending' : 'Are you still there?'}
          </h2>
        </div>
        <p className="mt-3 text-sm text-foreground-secondary">
          {atSessionLimit
            ? 'Your session has reached its time limit. Save your work now; you will need to sign in again.'
            : 'You will be logged out soon because of inactivity.'}
        </p>
        <p className="mt-4 text-center text-3xl font-semibold tabular-nums" aria-live="polite">
          {formatRemaining(remaining)}
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            Log out
          </button>
          {atSessionLimit ? (
            <button
              type="button"
              onClick={() => setDismissedLimit(sessionExpiresAt)}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
            >
              Continue working
            </button>
          ) : (
            <button
              type="button"
              onClick={staySignedIn}
              disabled={busy}
              autoFocus
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {busy ? 'Please wait...' : 'Stay signed in'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
