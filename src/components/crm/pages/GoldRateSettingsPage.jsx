'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '@/components/crm/ui/PageHeader';
import DataTable from '@/components/crm/ui/DataTable';
import Pagination from '@/components/crm/ui/Pagination';
import { Field, PrimaryButton } from '@/components/crm/ui/FormControls';
import { useThemeStore } from '@/lib/store/useThemeStore';
import { createGoldRateSetting, getCurrentGoldRateSetting, getGoldRateSettings } from '@/lib/services/goldRateSettingsService';

const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const emptyForm = () => ({ effectiveDate: today(), rate24k: '', rate22k: '', rate18k: '', ltvPercent: '', remark: '' });
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const errorText = (error) => error.response?.data?.message || error.message || 'Request failed';
const requiredLabel = (label) => <>{label}<span className="text-red-500" aria-label="required"> *</span></>;
const savedTime = (value) => value ? new Date(value).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : '—';
const historyColumns = [
  { key: 'effectiveDate', label: 'Effective Date', width: '150px' },
  { key: 'rate24k', label: '24K ₹/g', width: '125px', render: (row) => money(row.rates['24K']) },
  { key: 'rate22k', label: '22K ₹/g', width: '125px', render: (row) => money(row.rates['22K']) },
  { key: 'rate18k', label: '18K ₹/g', width: '125px', render: (row) => money(row.rates['18K']) },
  { key: 'ltvPercentage', label: 'LTV', width: '90px', render: (row) => `${row.ltvPercentage}%` },
  { key: 'savedBy', label: 'Saved By', width: '150px', render: (row) => row.savedBy || 'Automated' },
  { key: 'createdAt', label: 'Saved Time', width: '200px', render: (row) => savedTime(row.createdAt) },
];

export default function GoldRateSettingsPage() {
  const isDark = useThemeStore((state) => state.theme) === 'dark';
  const [form, setForm] = useState(emptyForm);
  const [current, setCurrent] = useState(null);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 0, total: 0 });
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async (page = 1, pageSize = perPage) => {
    const [settings, result] = await Promise.all([getCurrentGoldRateSetting(), getGoldRateSettings({ page, per_page: pageSize })]);
    setCurrent(settings);
    setHistory(result.data);
    setPagination(result.pagination);
    return settings;
  };

  useEffect(() => {
    let active = true;
    Promise.all([getCurrentGoldRateSetting(), getGoldRateSettings({ page: 1, per_page: 10 })])
      .then(([settings, result]) => {
        if (!active) return;
        setCurrent(settings);
        setHistory(result.data);
        setPagination(result.pagination);
        if (settings) setForm({
          effectiveDate: today(), rate24k: settings.rates['24K'], rate22k: settings.rates['22K'],
          rate18k: settings.rates['18K'], ltvPercent: settings.ltvPercentage, remark: '',
        });
      })
      .catch((requestError) => { if (active) setError(errorText(requestError)); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const update = (key, value) => setForm((previous) => ({ ...previous, [key]: value }));
  const loadHistoryPage = (page, pageSize = perPage) => load(page, pageSize).catch((requestError) => setError(errorText(requestError)));
  const changePageSize = (pageSize) => { setPerPage(pageSize); loadHistoryPage(1, pageSize); };
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createGoldRateSetting(form);
      await load(1);
      setForm((previous) => ({ ...previous, remark: '' }));
      toast.success('Gold rates saved');
    } catch (requestError) {
      const message = errorText(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const isExample = !form.rate22k || !form.ltvPercent;
  const previewRate = isExample ? 6280 : Number(form.rate22k);
  const previewLtv = isExample ? 75 : Number(form.ltvPercent);
  const sectionClass = `min-w-0 rounded-xl border-2 p-5 shadow-lg ${isDark
    ? 'border-gold-700/50 bg-gray-800 text-gray-100 shadow-gold-900/20'
    : 'border-gold-200 bg-white text-gray-900 shadow-gold-500/10'}`;
  const rateInputClass = `h-11 min-w-0 w-full rounded border-2 px-3 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${isDark
    ? 'border-gray-600 bg-gray-700 text-white [color-scheme:dark] hover:border-gold-500'
    : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-gold-400'}`;

  return <div className={`animate-fade-in min-h-screen w-full min-w-0 space-y-6 overflow-x-hidden p-3 transition-colors sm:p-4 md:p-6 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gold-50/30 text-gray-900'}`}>
    <PageHeader title="Gold Rate Settings" description="Rates apply across all branches. Each save creates a new history record." isDark={isDark} />
    {error && <p role="alert" className={`rounded-lg border px-4 py-3 text-sm ${isDark ? 'border-red-800/60 bg-red-950/30 text-red-300' : 'border-red-200 bg-red-50 text-red-700'}`}>{error}</p>}
    {!loading && !current && <p role="status" className={`rounded-lg border p-3 text-sm ${isDark ? 'border-amber-700/50 bg-amber-900/20 text-amber-300' : 'border-amber-300 bg-amber-50 text-amber-800'}`}>Today’s gold rates have not been set.</p>}
    <form onSubmit={save} className={`${sectionClass} ${isDark ? '[&_label>span]:text-gray-300' : ''}`}>
      <div className="grid grid-cols-2 items-end gap-4 xl:grid-cols-6">
        <Field label={requiredLabel('Effective Date')}><input className={rateInputClass} type="date" required value={form.effectiveDate} onChange={(event) => update('effectiveDate', event.target.value)} /></Field>
        {[['rate24k', '24K Rate — ₹/gram'], ['rate22k', '22K Rate — ₹/gram'], ['rate18k', '18K Rate — ₹/gram']].map(([key, label]) =>
          <Field key={key} label={requiredLabel(label)}><input className={rateInputClass} type="number" min="0.01" step="0.01" required value={form[key]} onChange={(event) => update(key, event.target.value)} /></Field>)}
        <Field label={requiredLabel('LTV %')}><input className={rateInputClass} type="number" min="0.01" max="100" step="0.01" required value={form.ltvPercent} onChange={(event) => update('ltvPercent', event.target.value)} /></Field>
        <Field label="Remark"><input className={rateInputClass} type="text" maxLength={1000} value={form.remark} onChange={(event) => update('remark', event.target.value)} /></Field>
      </div>
      <div className="mt-4 flex justify-end">
        <PrimaryButton type="submit" disabled={saving} className="cursor-pointer bg-gradient-to-r from-gold-500 to-gold-600 text-white hover:from-gold-600 hover:to-gold-700 disabled:cursor-not-allowed">{saving ? 'Saving…' : 'Save Rates'}</PrimaryButton>
      </div>
    </form>

    <section className={sectionClass}>
      <h2 className={`text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>Calculation preview</h2>
      <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{isExample ? 'Example values, not current market rates: ' : 'Using the entered 22K rate and LTV: '}
        10g net weight × {money(previewRate)}/g × {previewLtv}% = <strong className={isDark ? 'text-gold-300' : 'text-gold-700'}>{money(10 * previewRate * previewLtv / 100)} eligible amount</strong>.
      </p>
    </section>

    <section className="min-w-0">
      <h2 className={`mb-4 text-lg font-semibold ${isDark ? 'text-gold-400' : 'text-gold-600'}`}>Rate history</h2>
      <div className="hidden min-w-0 max-w-full lg:block">
        <DataTable columns={historyColumns} data={history} currentPage={pagination.current_page}
          totalPages={pagination.total_pages} totalItems={pagination.total} itemsPerPage={perPage}
          pageSizeOptions={[10, 20, 50, 100]} onPageChange={loadHistoryPage}
          onPageSizeChange={changePageSize} isDark={isDark}
          emptyMessage={loading ? 'Loading rates...' : 'No rates saved yet.'} />
      </div>
      <div className="lg:hidden">
        {history.length === 0 ? <div className={`rounded-xl border px-4 py-12 text-center text-sm ${isDark ? 'border-gold-700 bg-gray-800 text-gray-400' : 'border-gold-200 bg-white text-gray-500'}`}>
          {loading ? 'Loading rates...' : 'No rates saved yet.'}
        </div> : <div className="grid gap-3 sm:grid-cols-2">{history.map((row) => <article key={row.id} className={`min-w-0 rounded-xl border p-4 shadow-sm ${isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'}`}>
          <div className="flex items-start justify-between gap-3">
            <div><p className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Effective Date</p><h3 className="text-sm font-semibold text-gold-600 dark:text-gold-400">{row.effectiveDate}</h3></div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isDark ? 'bg-gold-900/40 text-gold-300' : 'bg-gold-100 text-gold-700'}`}>LTV {row.ltvPercentage}%</span>
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4">
            {[["24K Rate", money(row.rates['24K'])], ["22K Rate", money(row.rates['22K'])], ["18K Rate", money(row.rates['18K'])], ["Saved By", row.savedBy || 'Automated']].map(([label, value]) => <div key={label} className="min-w-0">
              <dt className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</dt>
              <dd className="break-words text-sm">{value}</dd>
            </div>)}
            <div className="col-span-2 min-w-0"><dt className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Saved Time</dt><dd className="text-sm">{savedTime(row.createdAt)}</dd></div>
          </dl>
        </article>)}</div>}
        {pagination.total_pages > 0 && <div className={`mt-3 overflow-hidden rounded-xl border ${isDark ? 'border-gold-700/50 bg-gray-800' : 'border-gold-200 bg-white'}`}>
          <Pagination currentPage={pagination.current_page} totalPages={pagination.total_pages}
            totalItems={pagination.total} itemsPerPage={perPage} pageSizeOptions={[10, 20, 50, 100]}
            onPageChange={loadHistoryPage} onPageSizeChange={changePageSize} isDark={isDark} />
        </div>}
      </div>
    </section>
  </div>;
}
