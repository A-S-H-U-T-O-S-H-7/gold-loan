'use client';

import { useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { Check, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { cropImageFile } from '@/lib/utils/cropImage';

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

const ASPECT_OPTIONS = [
  { key: 'original', label: 'Original' },
  { key: 'square', label: 'Square', ratio: 1 },
  { key: 'portrait', label: 'Portrait 3:4', ratio: 3 / 4 },
  { key: 'landscape', label: 'Card 4:3', ratio: 4 / 3 },
];

/*
 * Full-screen crop view shown after an image is picked: drag to move, pinch/scroll or the
 * slider to zoom, buttons to rotate. "Use Original" skips cropping; "Done" returns the crop.
 */
export default function ImageCropModal({ file, title, defaultAspect = 'original', onCancel, onDone }) {
  const [sourceUrl, setSourceUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspectKey, setAspectKey] = useState(defaultAspect);
  const [originalRatio, setOriginalRatio] = useState(1);
  const [areaPixels, setAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setSourceUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !saving) onCancel();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [saving, onCancel]);

  const aspect = ASPECT_OPTIONS.find((option) => option.key === aspectKey)?.ratio ?? originalRatio;
  const rotate = (degrees) => setRotation((current) => (current + degrees + 360) % 360);

  const reset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspectKey(defaultAspect);
  };

  const finish = async () => {
    if (!areaPixels) return;
    setSaving(true);
    setError('');
    try {
      onDone(await cropImageFile(sourceUrl, areaPixels, rotation, file));
    } catch (caught) {
      setError(caught.message || 'Could not crop the image');
      setSaving(false);
    }
  };

  const toolButton = 'inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div role="dialog" aria-modal="true" aria-label={`Crop ${title}`} className="fixed inset-0 z-120 flex flex-col bg-black">
      <header className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <button type="button" onClick={onCancel} disabled={saving} aria-label="Cancel" className={toolButton}>
          <X className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <p className="truncate font-semibold">Crop {title}</p>
          <p className="text-xs text-gray-400">Drag to move · pinch or scroll to zoom</p>
        </div>
        <button type="button" onClick={reset} disabled={saving} className="cursor-pointer rounded-full px-3 py-2 text-sm font-medium text-gold-300 hover:bg-white/10 disabled:opacity-40">
          Reset
        </button>
      </header>

      <div className="relative flex-1">
        {sourceUrl && (
          <Cropper
            image={sourceUrl}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={(_, pixels) => setAreaPixels(pixels)}
            onMediaLoaded={(media) => setOriginalRatio(media.naturalWidth / media.naturalHeight)}
          />
        )}
      </div>

      <footer className="space-y-3 px-4 pb-5 pt-3 text-white">
        <div className="flex flex-wrap justify-center gap-2">
          {ASPECT_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setAspectKey(option.key)}
              aria-pressed={aspectKey === option.key}
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                aspectKey === option.key ? 'bg-gold-500 text-gray-900' : 'bg-white/10 text-gray-200 hover:bg-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mx-auto flex max-w-xl items-center gap-3">
          <button type="button" onClick={() => rotate(-90)} disabled={saving} aria-label="Rotate left" className={toolButton}>
            <RotateCcw className="h-5 w-5" />
          </button>
          <ZoomOut className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.05}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            aria-label="Zoom"
            className="min-w-0 flex-1 cursor-pointer accent-gold-500"
          />
          <ZoomIn className="h-4 w-4 shrink-0 text-gray-400" />
          <button type="button" onClick={() => rotate(90)} disabled={saving} aria-label="Rotate right" className={toolButton}>
            <RotateCw className="h-5 w-5" />
          </button>
        </div>

        {error && <p role="alert" className="text-center text-sm text-red-400">{error}</p>}

        <div className="mx-auto flex max-w-xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onDone(file)}
            disabled={saving}
            className="cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-40"
          >
            Use Original
          </button>
          <button
            type="button"
            onClick={finish}
            disabled={saving || !areaPixels}
            aria-label="Done"
            className="inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-gold-500 text-gray-900 shadow-lg transition-colors hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              : <Check className="h-6 w-6" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
