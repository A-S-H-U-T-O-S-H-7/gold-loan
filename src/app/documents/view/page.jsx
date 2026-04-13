"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";

const imagePattern = /\.(png|jpe?g|gif|webp|bmp|svg)$/i;
const pdfPattern = /\.pdf($|\?)/i;

export default function DocumentViewPage() {
  const searchParams = useSearchParams();
  const file = searchParams.get("file") || "";
  const decodedFile = useMemo(() => decodeURIComponent(file), [file]);

  useEffect(() => {
    if (!decodedFile) return;
    if (/^https?:\/\//i.test(decodedFile) && !imagePattern.test(decodedFile) && !pdfPattern.test(decodedFile)) {
      window.location.replace(decodedFile);
    }
  }, [decodedFile]);

  if (!decodedFile) {
    return <div className="p-6">No document selected.</div>;
  }

  if (imagePattern.test(decodedFile)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black p-4">
        <img src={decodedFile} alt="Document" className="max-h-[95vh] max-w-full rounded-lg object-contain" />
      </div>
    );
  }

  return (
    <iframe
      src={decodedFile}
      title="Document Viewer"
      className="h-screen w-full border-0"
    />
  );
}
