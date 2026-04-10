"use client";

import { useRef, useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";

export interface FileUploadItem {
  url: string;
  file: File;
}

interface FileUploadProps {
  label: string;
  accept?: "image" | "video" | "both";
  value?: string; // current preview URL
  onChange?: (url: string, file: File) => void;
  onFilesChange?: (items: FileUploadItem[]) => void;
  onClear?: () => void;
  previewHeight?: string;
  persistMode?: "object-url" | "data-url";
  previewFit?: "cover" | "contain";
  compactTrigger?: boolean;
  multiple?: boolean;
}

export default function FileUpload({
  label,
  accept = "image",
  value,
  onChange,
  onFilesChange,
  onClear,
  previewHeight = "h-36",
  persistMode = "object-url",
  previewFit = "cover",
  compactTrigger = false,
  multiple = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const acceptStr =
    accept === "image"
      ? "image/*"
      : accept === "video"
      ? "video/*"
      : "image/*,video/*";

  const createUploadItem = async (file: File): Promise<FileUploadItem> => {
    const url =
      persistMode === "data-url"
        ? await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
              if (typeof reader.result === "string") {
                resolve(reader.result);
                return;
              }

              reject(new Error("Unable to read file"));
            };

            reader.onerror = () => reject(new Error("Unable to read file"));
            reader.readAsDataURL(file);
          })
        : URL.createObjectURL(file);

    return { url, file };
  };

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;

    const uploadItems = await Promise.all(
      files.map((file) => createUploadItem(file)),
    );

    if (multiple) {
      if (onFilesChange) {
        onFilesChange(uploadItems);
        return;
      }

      uploadItems.forEach(({ url, file }) => onChange?.(url, file));
      return;
    }

    const [firstItem] = uploadItems;
    if (!firstItem) return;

    onChange?.(firstItem.url, firstItem.file);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      void handleFiles(files);
    }
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files ?? []);
    if (files.length > 0) {
      void handleFiles(files);
    }
  };

  const isVideo = value && (value.startsWith("blob:") ? false : /\.(mp4|mov|webm|avi)$/i.test(value));
  const isLocalPreview = value?.startsWith("blob:") || value?.startsWith("data:");

  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>

      {/* Preview */}
      {value && (
        <div className={`relative mb-2 rounded-xl overflow-hidden bg-[#F3F4F6] ${previewHeight}`}>
          {isVideo ? (
            <video src={value} className="w-full h-full object-cover" controls muted />
          ) : (
            <FlexibleImage
              src={value}
              alt="preview"
              fill
              sizes="(max-width: 768px) 100vw, 320px"
              className={`w-full h-full ${previewFit === "contain" ? "object-contain p-2 bg-white" : "object-cover"}`}
            />
          )}
          {onClear && (
            <button
              type="button"
              onClick={() => { onClear(); }}
              className="absolute top-2 left-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {isLocalPreview && (
            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
              معاينة محلية
            </span>
          )}
        </div>
      )}

      {/* Drop Zone */}
      {compactTrigger ? (
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1D5DB] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:border-[#9CA3AF] hover:text-[#111] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            {value ? "تغيير الصورة" : "رفع صورة"}
          </button>
          <p className="mt-2 text-[11px] text-[#9CA3AF]">
            {accept === "image" ? "PNG, JPG, WEBP" : accept === "video" ? "MP4, MOV, WEBM" : "صور أو فيديو"}
          </p>
        </div>
      ) : (
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
      )}

      <input
        ref={inputRef}
        type="file"
        accept={acceptStr}
        multiple={multiple}
        onChange={handleInput}
        className="hidden"
      />
    </div>
  );
}
