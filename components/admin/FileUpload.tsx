"use client";

import { useRef, useState } from "react";

interface FileUploadProps {
  label: string;
  accept?: "image" | "video" | "both";
  value?: string; // current preview URL
  onChange: (url: string, file: File) => void;
  onClear?: () => void;
  previewHeight?: string;
}

export default function FileUpload({
  label,
  accept = "image",
  value,
  onChange,
  onClear,
  previewHeight = "h-36",
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const acceptStr =
    accept === "image"
      ? "image/*"
      : accept === "video"
      ? "video/*"
      : "image/*,video/*";

  const handleFile = (file: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(url, file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const isVideo = value && (value.startsWith("blob:") ? false : /\.(mp4|mov|webm|avi)$/i.test(value));
  const isBlob = value?.startsWith("blob:");

  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>

      {/* Preview */}
      {value && (
        <div className={`relative mb-2 rounded-xl overflow-hidden bg-[#F3F4F6] ${previewHeight}`}>
          {isVideo ? (
            <video src={value} className="w-full h-full object-cover" controls muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => { onClear?.(); }}
            className="absolute top-2 left-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {isBlob && (
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
              معاينة محلية
            </span>
          )}
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-5 cursor-pointer transition-all ${
          dragging
            ? "border-[#111] bg-[#F3F4F6]"
            : "border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#FAFAFA]"
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#F3F4F6] flex items-center justify-center">
          {accept === "video" ? (
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#6B7280]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          )}
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-[#111]">
            {value ? "تغيير الملف" : "رفع ملف"}
          </p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5">
            اسحب وأفلت أو اضغط للاختيار •{" "}
            {accept === "image" ? "PNG, JPG, WEBP" : accept === "video" ? "MP4, MOV, WEBM" : "صور أو فيديو"}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={acceptStr}
        onChange={handleInput}
        className="hidden"
      />
    </div>
  );
}
