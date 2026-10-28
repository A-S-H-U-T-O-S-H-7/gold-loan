'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axiosInsatnce';

// Files need the staff auth header, so they are fetched as blobs instead of a plain <img src>.
export default function ProtectedImage({ path, alt }) {
  const [src, setSrc] = useState(null);
  const [isImage, setIsImage] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let objectUrl;

    api.get(path, { responseType: 'blob' })
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setIsImage(blob.type.startsWith('image/'));
        setSrc(objectUrl);
      })
      .catch(() => { if (active) setFailed(true); });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (failed) return <span className="text-xs text-red-500">Photo unavailable</span>;
  if (!src) return <span className="text-xs text-gray-500">Loading...</span>;

  return (
    <a href={src} target="_blank" rel="noreferrer" className="cursor-pointer text-xs text-gold-600 underline">
      {isImage
        ? <img src={src} alt={alt} className="h-14 w-14 rounded-lg border border-gold-200 object-cover" />
        : `View ${alt}`}
    </a>
  );
}
