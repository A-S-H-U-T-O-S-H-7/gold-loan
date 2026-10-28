'use client';

import { useEffect, useState } from 'react';
import { ImagePlus, Trash2, X } from 'lucide-react';
import { getGoldItemImage } from '@/lib/services/goldEvaluationService';

function Photo({ image, onRemove }) {
  const [fetchedUrl, setUrl] = useState('');
  // Unsaved uploads have no id yet, so preview them from the local file.
  const url = image.id ? fetchedUrl : image.previewUrl;
  useEffect(() => {
    if (!image.id) return undefined;
    let active = true;
    let objectUrl = '';
    getGoldItemImage(image.id).then((blob) => {
      if (!active) return;
      objectUrl = URL.createObjectURL(blob);
      setUrl(objectUrl);
    }).catch(() => { if (active) setUrl(''); });
    return () => { active = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [image.id]);
  return <div className="relative h-20 w-20 rounded-lg border bg-gray-50">
    {url ? <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="Gold item" className="h-full w-full rounded-lg object-cover" /></a>
      : <span className="flex h-full items-center justify-center px-1 text-center text-xs text-gray-600">{image.id ? 'Photo unavailable' : 'New photo'}</span>}
    <button type="button" aria-label="Remove photo" onClick={onRemove}
      className="absolute -right-2 -top-2 cursor-pointer rounded-full bg-red-600 p-1 text-white"><X className="h-3 w-3" /></button>
  </div>;
}

export default function EvaluationItemCard({ item, index, isDark, busy, onChange, onRemove, onUpload }) {
  const inputClass = `w-full rounded border-2 px-3 py-2 text-sm outline-none transition-colors focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 ${isDark ? 'border-gray-600 bg-gray-700 text-white hover:border-gold-500' : 'border-gray-300 bg-gray-50 text-gray-900 hover:border-gold-400'}`;
  const labelClass = `mb-1 block text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const field = (label, key, type = 'text', options = null) => <label className="block text-sm">
    <span className={labelClass}>{label}{['itemType', 'quantity', 'purity', 'grossWeight'].includes(key) && <span className="text-red-500" aria-label="required"> *</span>}</span>
    {options ? <select value={item[key] ?? ''} onChange={(event) => onChange({ ...item, [key]: event.target.value })}
      className={inputClass}>
      <option value="">Select</option>{options.map((option) => <option key={option}>{option}</option>)}
    </select> : <input type={type} step={type === 'number' ? '0.001' : undefined} min={type === 'number' ? '0' : undefined}
      value={item[key] ?? ''} onChange={(event) => onChange({ ...item, [key]: event.target.value })}
      className={inputClass} />}
  </label>;

  return <article className={`mt-4 rounded-lg border p-4 ${isDark ? 'border-gray-700 bg-gray-800/60' : 'border-gold-200 bg-gold-50/30'}`}>
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-semibold">Gold Item {index + 1}</h3>
      <button type="button" onClick={onRemove} disabled={busy} aria-label={`Remove gold item ${index + 1}`}
        className="cursor-pointer rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
    </div>
    <div className="overflow-x-auto pb-2">
    <div className="grid min-w-[1120px] grid-cols-8 gap-3">
      {field('Type', 'itemType', 'text', ['Ring', 'Chain', 'Bangle', 'Earring', 'Coin', 'Biscuit', 'Other'])}
      {field('Quantity', 'quantity', 'number')}
      {field('Purity', 'purity', 'text', ['18K', '22K', '24K', 'Mixed'])}
      {field('Gross weight (g)', 'grossWeight', 'number')}
      {field('Deduction weight (g)', 'deductionWeight', 'number')}
      <div className="text-sm"><span className={labelClass}>Net weight</span><div className={inputClass}>{Math.max(0, Number(item.grossWeight || 0) - Number(item.deductionWeight || 0)).toFixed(3)} g</div></div>
      <div className="text-sm"><span className={labelClass}>Rate per net gram</span><div className={inputClass}>{item.rateUsed ? `₹${Number(item.rateUsed).toLocaleString('en-IN')}` : 'Awaiting backend rate'}</div></div>
      <label className="block text-sm"><span className={labelClass}>Description / Item Remarks</span>
        <input value={item.description ?? ''} onChange={(event) => onChange({ ...item, description: event.target.value })}
          className={inputClass} /></label>
    </div>
    </div>
    <p className="mt-2 text-xs text-gray-500">A backend rate for this purity is needed. Valuation uses net weight × that rate.</p>
    <p className="mt-1 text-sm">Estimated valuation: <strong>₹{(Math.max(0, Number(item.grossWeight || 0) - Number(item.deductionWeight || 0)) * Number(item.rateUsed || 0)).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</strong></p>
    <div className="mt-4 flex flex-wrap items-center gap-3">
      {(item.images || []).map((image) => <Photo key={image.id || image.fileKey}
        image={image} onRemove={() => onChange({ ...item, images: item.images.filter((candidate) => candidate.fileKey !== image.fileKey) })} />)}
      <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dashed px-3 py-3 text-sm ${isDark ? 'border-gold-600' : 'border-gold-300'}`}>
        <ImagePlus className="h-4 w-4" />Add photo<span className="text-red-500" aria-label="required">*</span>
        <input type="file" accept="image/png,image/jpeg" className="sr-only" disabled={busy}
          onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(item, file); event.target.value = ''; }} />
      </label>
    </div>
  </article>;
}
