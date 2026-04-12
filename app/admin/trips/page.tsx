"use client";

import { useState, useEffect, useCallback } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import FileUpload from "@/components/admin/FileUpload";
import { formatPrice } from "@/lib/currency";
import { toYouTubeEmbedUrl } from "@/lib/youtube";
import {
  listTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  slugifyTrip,
  type TripRecord,
  type TripMutationInput,
  type TripMediaInput,
} from "@/lib/trip-service";

interface OptionInput {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
}

interface AddOnInput {
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
}

type GalleryUploadItem = {
  url: string;
  file: File;
};

interface TripForm {
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  descriptionAr: string;
  descriptionEn: string;
  heroImage: string;
  galleryImages: string[];
  youtubeUrl: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  durationAr: string;
  durationEn: string;
  includesAr: string[];
  includesEn: string[];
  options: OptionInput[];
  addOns: AddOnInput[];
}

const emptyForm: TripForm = {
  slug: "",
  titleAr: "",
  titleEn: "",
  taglineAr: "",
  taglineEn: "",
  descriptionAr: "",
  descriptionEn: "",
  heroImage: "",
  galleryImages: [],
  youtubeUrl: "",
  startingPrice: 0,
  startTime: "",
  endTime: "",
  durationAr: "",
  durationEn: "",
  includesAr: [],
  includesEn: [],
  options: [],
  addOns: [],
};

const emptyOptionInput: OptionInput = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: 0,
};

const emptyAddOnInput: AddOnInput = {
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  price: 0,
};

function normalizeOptionForPersistence(option: OptionInput) {
  const nameAr = option.nameAr.trim();
  const descriptionAr = option.descriptionAr.trim();

  return {
    price: Number.isFinite(option.price) ? Math.max(0, option.price) : 0,
    nameAr,
    nameEn: option.nameEn.trim() || nameAr,
    descriptionAr,
    descriptionEn: option.descriptionEn.trim() || descriptionAr,
  };
}

function normalizeAddOnForPersistence(addOn: AddOnInput) {
  const nameAr = addOn.nameAr.trim();
  const descriptionAr = addOn.descriptionAr.trim();

  return {
    price: Number.isFinite(addOn.price) ? Math.max(0, addOn.price) : 0,
    nameAr,
    nameEn: addOn.nameEn.trim() || nameAr,
    descriptionAr,
    descriptionEn: addOn.descriptionEn.trim() || descriptionAr,
  };
}

function createTripMutationInput(form: TripForm, slug: string): TripMutationInput {
  const normalizedStartTime = normalizeTimeInput(form.startTime);
  const normalizedEndTime = normalizeTimeInput(form.endTime);
  const durationLabels = calculateDurationLabels(normalizedStartTime, normalizedEndTime);

  return {
    slug,
    price: Number.isFinite(form.startingPrice) ? Math.max(0, form.startingPrice) : 0,
    startTime: normalizedStartTime,
    endTime: normalizedEndTime,
    youtubeUrl: form.youtubeUrl.trim(),
    titleAr: form.titleAr.trim(),
    titleEn: form.titleEn.trim() || form.titleAr.trim(),
    subtitleAr: form.taglineAr.trim(),
    subtitleEn: form.taglineEn.trim() || form.taglineAr.trim(),
    descriptionAr: form.descriptionAr.trim(),
    descriptionEn: form.descriptionEn.trim() || form.descriptionAr.trim(),
    durationAr: durationLabels?.durationAr ?? form.durationAr.trim(),
    durationEn: durationLabels?.durationEn ?? form.durationEn.trim(),
    facilitiesAr: form.includesAr.map((value) => value.trim()).filter(Boolean),
    facilitiesEn: form.includesEn.map((value) => value.trim()).filter(Boolean),
    options: form.options.map(normalizeOptionForPersistence),
    addons: form.addOns.map(normalizeAddOnForPersistence),
  };
}

function stripCollectionsFromMutationInput(
  input: TripMutationInput,
): TripMutationInput {
  return {
    ...input,
    options: undefined,
    addons: undefined,
  };
}

function didTripCollectionsChange(originalTrip: TripRecord, form: TripForm) {
  const originalOptions = originalTrip.options.map((option) =>
    normalizeOptionForPersistence({
      nameAr: option.nameAr,
      nameEn: option.nameEn,
      descriptionAr: option.descriptionAr,
      descriptionEn: option.descriptionEn,
      price: option.price,
    }),
  );
  const nextOptions = form.options.map(normalizeOptionForPersistence);

  if (JSON.stringify(originalOptions) !== JSON.stringify(nextOptions)) {
    return true;
  }

  const originalAddOns = originalTrip.addOns.map((addOn) =>
    normalizeAddOnForPersistence({
      nameAr: addOn.nameAr,
      nameEn: addOn.nameEn,
      descriptionAr: addOn.descriptionAr,
      descriptionEn: addOn.descriptionEn,
      price: addOn.price,
    }),
  );
  const nextAddOns = form.addOns.map(normalizeAddOnForPersistence);

  return JSON.stringify(originalAddOns) !== JSON.stringify(nextAddOns);
}

function isTemporaryPreviewUrl(url: string) {
  return url.startsWith("blob:") || url.startsWith("data:");
}

function inferFileExtension(url: string, mimeType: string) {
  const mimeExtension = mimeType.split("/")[1]?.split(";")[0]?.toLowerCase();
  if (mimeExtension) {
    return mimeExtension === "jpeg" ? "jpg" : mimeExtension;
  }

  try {
    const pathname = new URL(url).pathname;
    const extension = pathname.split(".").pop()?.toLowerCase();
    if (extension) return extension;
  } catch {
    return "jpg";
  }

  return "jpg";
}

async function fetchImageAsFile(url: string, baseName: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("تعذر تحميل إحدى صور الرحلة الحالية لإعادة حفظها.");
  }

  const blob = await response.blob();
  const extension = inferFileExtension(url, blob.type);

  return new File([blob], `${baseName}.${extension}`, {
    type: blob.type || "application/octet-stream",
  });
}

async function buildReplacementTripMedia({
  heroImage,
  heroFile,
  galleryImages,
  newGalleryItems,
}: {
  heroImage: string;
  heroFile: File | null;
  galleryImages: string[];
  newGalleryItems: GalleryUploadItem[];
}): Promise<TripMediaInput> {
  const resolveGalleryFile = async (url: string, index: number) => {
    if (isTemporaryPreviewUrl(url)) {
      const matchingItem = newGalleryItems.find((item) => item.url === url);
      if (matchingItem) return matchingItem.file;
      throw new Error("تعذر مطابقة إحدى صور المعرض الجديدة قبل الحفظ.");
    }

    return fetchImageAsFile(url, `trip-gallery-${index + 1}`);
  };

  let mainImageFiles = heroFile ? [heroFile] : [];
  if (!mainImageFiles.length && heroImage) {
    mainImageFiles = [await fetchImageAsFile(heroImage, "trip-main")];
  }

  let galleryFiles = await Promise.all(
    galleryImages.map((image, index) => resolveGalleryFile(image, index)),
  );

  if (!mainImageFiles.length && galleryFiles.length > 0) {
    mainImageFiles = [galleryFiles[0]];
    galleryFiles = galleryFiles.slice(1);
  }

  if (!mainImageFiles.length) {
    throw new Error("يجب تحديد صورة رئيسية واحدة على الأقل للرحلة.");
  }

  return {
    mainImageFiles,
    galleryFiles: galleryFiles.length > 0 ? galleryFiles : undefined,
  };
}

function padTimeUnit(value: number) {
  return String(value).padStart(2, "0");
}

function normalizeTimeInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const twentyFourHourMatch = trimmed.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (twentyFourHourMatch) {
    return `${padTimeUnit(Number(twentyFourHourMatch[1]))}:${twentyFourHourMatch[2]}`;
  }

  const twelveHourMatch = trimmed.match(/^(\d{1,2}):([0-5]\d)\s*([AP]M)$/i);
  if (!twelveHourMatch) return "";

  let hours = Number(twelveHourMatch[1]) % 12;
  if (twelveHourMatch[3].toUpperCase() === "PM") {
    hours += 12;
  }

  return `${padTimeUnit(hours)}:${twelveHourMatch[2]}`;
}

function parseTimeToMinutes(value: string) {
  const normalized = normalizeTimeInput(value);
  if (!normalized) return null;

  const [hours, minutes] = normalized.split(":").map(Number);
  return (hours * 60) + minutes;
}

function formatArabicHours(hours: number) {
  if (hours === 1) return "ساعة";
  if (hours === 2) return "ساعتان";
  if (hours >= 3 && hours <= 10) return `${hours} ساعات`;
  return `${hours} ساعة`;
}

function formatArabicMinutes(minutes: number) {
  if (minutes === 1) return "دقيقة";
  if (minutes === 2) return "دقيقتان";
  if (minutes >= 3 && minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
}

function calculateDurationLabels(startTime: string, endTime: string) {
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);

  if (startMinutes === null || endMinutes === null) {
    return null;
  }

  let totalMinutes = endMinutes - startMinutes;
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }

  if (totalMinutes === 0) {
    return null;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const durationArParts: string[] = [];
  const durationEnParts: string[] = [];

  if (hours > 0) {
    durationArParts.push(formatArabicHours(hours));
    durationEnParts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (minutes > 0) {
    durationArParts.push(formatArabicMinutes(minutes));
    durationEnParts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  }

  return {
    durationAr: durationArParts.join(" و "),
    durationEn: durationEnParts.join(" and "),
  };
}

function tripRecordToForm(trip: TripRecord): TripForm {
  return {
    slug: trip.slug,
    titleAr: trip.titleAr,
    titleEn: trip.titleEn,
    taglineAr: trip.taglineAr,
    taglineEn: trip.taglineEn,
    descriptionAr: trip.descriptionAr,
    descriptionEn: trip.descriptionEn,
    heroImage: trip.heroImage,
    galleryImages: [...trip.galleryImages],
    youtubeUrl: trip.youtubeUrl,
    startingPrice: trip.startingPrice,
    startTime: normalizeTimeInput(trip.schedule.startTime),
    endTime: normalizeTimeInput(trip.schedule.endTime),
    durationAr: trip.schedule.durationAr,
    durationEn: trip.schedule.durationEn,
    includesAr: [...trip.includesAr],
    includesEn: [...trip.includesEn],
    options: trip.options.map((o) => ({
      nameAr: o.nameAr,
      nameEn: o.nameEn,
      descriptionAr: o.descriptionAr,
      descriptionEn: o.descriptionEn,
      price: o.price,
    })),
    addOns: trip.addOns.map((a) => ({
      nameAr: a.nameAr,
      nameEn: a.nameEn,
      descriptionAr: a.descriptionAr,
      descriptionEn: a.descriptionEn,
      price: a.price,
    })),
  };
}

function collectRemovedAssetIds(
  assetIdsByUrl: Record<string, string[]> | undefined,
  currentUrls: string[],
) {
  const currentUrlSet = new Set(currentUrls);

  return Array.from(
    new Set(
      Object.entries(assetIdsByUrl ?? {})
        .filter(([url]) => !currentUrlSet.has(url))
        .flatMap(([, assetIds]) => assetIds),
    ),
  );
}

function StringListSection({
  label,
  placeholder,
  items,
  onAdd,
  onRemove,
}: {
  label: string;
  placeholder?: string;
  items: string[];
  onAdd: (value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    if (!input.trim()) return;
    onAdd(input.trim());
    setInput("");
  };

  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1 border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
          placeholder={placeholder || "أضف عنصراً..."}
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2.5 bg-[#F3F4F6] rounded-xl text-sm font-medium hover:bg-[#E5E7EB] transition-colors"
        >
          إضافة
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="inline-flex items-center gap-1 bg-[#F3F4F6] rounded-full px-3 py-1 text-xs text-[#374151]">
            {item}
            <button type="button" onClick={() => onRemove(index)} className="text-[#9CA3AF] hover:text-[#EF4444]">
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AdminTrips() {
  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<TripRecord | null>(null);
  const [form, setForm] = useState<TripForm>({ ...emptyForm });
  const [optionInput, setOptionInput] = useState<OptionInput>({ ...emptyOptionInput });
  const [addOnInput, setAddOnInput] = useState<AddOnInput>({ ...emptyAddOnInput });

  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const [editingAddOnIndex, setEditingAddOnIndex] = useState<number | null>(null);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  // Each new gallery item stores both the blob URL and the File together
  // so removing a preview also removes the corresponding file
  const [newGalleryItems, setNewGalleryItems] = useState<GalleryUploadItem[]>([]);
  const [deleteAssetIds, setDeleteAssetIds] = useState<string[]>([]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [galleryKey, setGalleryKey] = useState(0);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchTrips = useCallback(async () => {
    try {
      setError(null);
      const result = await listTrips({ page: 1, limit: 100 });
      setTrips(result.trips);
    } catch (err) {
      setError(err instanceof Error ? err.message : "فشل في تحميل الرحلات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  const totalOptions = trips.reduce((sum, trip) => sum + trip.options.length, 0);
  const totalAddOns = trips.reduce((sum, trip) => sum + trip.addOns.length, 0);

  const resetFormState = () => {
    setForm({ ...emptyForm });
    setOptionInput({ ...emptyOptionInput });
    setAddOnInput({ ...emptyAddOnInput });
    setEditingOptionIndex(null);
    setEditingAddOnIndex(null);
    setHeroFile(null);
    setNewGalleryItems([]);
    setDeleteAssetIds([]);
    setGalleryKey((v) => v + 1);
  };

  const updateScheduleField = (field: "startTime" | "endTime", value: string) => {
    setForm((current) => {
      const nextForm = {
        ...current,
        [field]: value,
      };
      const durationLabels = calculateDurationLabels(nextForm.startTime, nextForm.endTime);

      return {
        ...nextForm,
        durationAr: durationLabels?.durationAr ?? "",
        durationEn: durationLabels?.durationEn ?? "",
      };
    });
  };

  const openAdd = () => {
    setEditing(null);
    resetFormState();
    setShowModal(true);
  };

  const openEdit = (trip: TripRecord) => {
    setEditing(trip);
    setForm(tripRecordToForm(trip));
    setOptionInput({ ...emptyOptionInput });
    setAddOnInput({ ...emptyAddOnInput });
    setEditingOptionIndex(null);
    setEditingAddOnIndex(null);
    setHeroFile(null);
    setNewGalleryItems([]);
    setDeleteAssetIds([]);
    setGalleryKey((v) => v + 1);
    setShowModal(true);
  };

  const addOption = () => {
    if (!optionInput.nameAr.trim()) return;
    const newOption = {
      nameAr: optionInput.nameAr.trim(),
      nameEn: optionInput.nameEn.trim(),
      descriptionAr: optionInput.descriptionAr.trim(),
      descriptionEn: optionInput.descriptionEn.trim() || optionInput.descriptionAr.trim(),
      price: optionInput.price,
    };

    if (editingOptionIndex !== null) {
      setForm((cur) => ({
        ...cur,
        options: cur.options.map((o, i) => (i === editingOptionIndex ? newOption : o)),
      }));
      setEditingOptionIndex(null);
    } else {
      setForm((cur) => ({
        ...cur,
        options: [...cur.options, newOption],
      }));
    }
    setOptionInput({ ...emptyOptionInput });
  };

  const startEditOption = (index: number) => {
    const option = form.options[index];
    setOptionInput({ ...option });
    setEditingOptionIndex(index);
  };

  const cancelEditOption = () => {
    setOptionInput({ ...emptyOptionInput });
    setEditingOptionIndex(null);
  };

  const addAddOn = () => {
    if (!addOnInput.nameAr.trim()) return;
    const newAddOn = {
      nameAr: addOnInput.nameAr.trim(),
      nameEn: addOnInput.nameEn.trim(),
      descriptionAr: addOnInput.descriptionAr.trim(),
      descriptionEn: addOnInput.descriptionEn.trim() || addOnInput.descriptionAr.trim(),
      price: addOnInput.price,
    };

    if (editingAddOnIndex !== null) {
      setForm((cur) => ({
        ...cur,
        addOns: cur.addOns.map((a, i) => (i === editingAddOnIndex ? newAddOn : a)),
      }));
      setEditingAddOnIndex(null);
    } else {
      setForm((cur) => ({
        ...cur,
        addOns: [...cur.addOns, newAddOn],
      }));
    }
    setAddOnInput({ ...emptyAddOnInput });
  };

  const startEditAddOn = (index: number) => {
    const addOn = form.addOns[index];
    setAddOnInput({ ...addOn });
    setEditingAddOnIndex(index);
  };

  const cancelEditAddOn = () => {
    setAddOnInput({ ...emptyAddOnInput });
    setEditingAddOnIndex(null);
  };

  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

  const validateFileSize = (file: File | null, label: string): string | null => {
    if (!file) return null;
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `${label}: حجم الملف (${sizeMB}MB) يتجاوز الحد المسموح (2MB). يرجى ضغط الصورة أو اختيار صورة أصغر.`;
    }
    return null;
  };

  const appendGalleryImages = (items: GalleryUploadItem[]) => {
    const acceptedItems: GalleryUploadItem[] = [];
    let rejectedCount = 0;

    for (const item of items) {
      if (validateFileSize(item.file, "صورة المعرض")) {
        rejectedCount += 1;
        continue;
      }

      acceptedItems.push(item);
    }

    if (acceptedItems.length > 0) {
      setForm((current) => ({
        ...current,
        galleryImages: [...current.galleryImages, ...acceptedItems.map((item) => item.url)],
      }));
      setNewGalleryItems((current) => [...current, ...acceptedItems]);
    }

    if (rejectedCount > 0) {
      setNotice({
        type: "error",
        message:
          rejectedCount === 1
            ? "تم تجاهل صورة واحدة لأن حجمها يتجاوز 2MB."
            : `تم تجاهل ${rejectedCount} صور لأن حجمها يتجاوز 2MB.`,
      });
    }

    setGalleryKey((value) => value + 1);
  };

  const handleSave = async () => {
    if (!form.titleAr.trim()) return;

    const normalizedStartTime = normalizeTimeInput(form.startTime);
    const normalizedEndTime = normalizeTimeInput(form.endTime);
    const durationLabels = calculateDurationLabels(normalizedStartTime, normalizedEndTime);

    if (!normalizedStartTime || !normalizedEndTime) {
      setNotice({ type: "error", message: "يرجى تحديد وقت البداية ووقت النهاية للرحلة." });
      return;
    }

    if (!durationLabels) {
      setNotice({ type: "error", message: "وقت النهاية يجب أن يكون مختلفاً عن وقت البداية." });
      return;
    }

    const heroSizeError = validateFileSize(heroFile, "الصورة الرئيسية");
    if (heroSizeError) {
      setNotice({ type: "error", message: heroSizeError });
      return;
    }
    if (form.youtubeUrl.trim() && !toYouTubeEmbedUrl(form.youtubeUrl)) {
      setNotice({ type: "error", message: "يرجى إدخال رابط يوتيوب صحيح أو معرّف فيديو صالح." });
      return;
    }

    for (const item of newGalleryItems) {
      const gallerySizeError = validateFileSize(item.file, "صورة المعرض");
      if (gallerySizeError) {
        setNotice({ type: "error", message: gallerySizeError });
        return;
      }
    }

    setSaving(true);

    try {
      const slug = form.slug.trim() || slugifyTrip(form.titleEn || form.titleAr);

      const mutationInput = createTripMutationInput(
        {
          ...form,
          startTime: normalizedStartTime,
          endTime: normalizedEndTime,
          durationAr: durationLabels.durationAr,
          durationEn: durationLabels.durationEn,
        },
        slug,
      );

      const media: TripMediaInput = {
        mainImageFiles: heroFile ? [heroFile] : undefined,
        galleryFiles: newGalleryItems.length > 0 ? newGalleryItems.map((i) => i.file) : undefined,
        deleteAssetIds: Array.from(
          new Set([
            ...deleteAssetIds,
            ...(editing
              ? collectRemovedAssetIds(editing.imageAssetIdsByUrl, [
                  ...(form.heroImage ? [form.heroImage] : []),
                  ...form.galleryImages,
                ])
              : []),
          ]),
        ),
      };

      if (editing) {
        if (didTripCollectionsChange(editing, form)) {
          const originalTripInput = createTripMutationInput(
            tripRecordToForm(editing),
            editing.slug,
          );
          const temporarySlug = `${editing.slug || slug}-replacing-${Date.now()}`;

          await updateTrip(
            editing.id,
            stripCollectionsFromMutationInput({
              ...originalTripInput,
              slug: temporarySlug,
            }),
          );

          let replacementTripId = "";

          try {
            const replacementMedia = await buildReplacementTripMedia({
              heroImage: form.heroImage,
              heroFile,
              galleryImages: form.galleryImages,
              newGalleryItems,
            });

            const replacementTrip = await createTrip(mutationInput, replacementMedia);
            replacementTripId = replacementTrip.id;
            await deleteTrip(editing.id);
          } catch (error) {
            if (replacementTripId) {
              await deleteTrip(replacementTripId).catch(() => undefined);
            }

            await updateTrip(
              editing.id,
              stripCollectionsFromMutationInput({
                ...originalTripInput,
                slug: editing.slug,
              }),
            ).catch(() => undefined);

            throw error;
          }
        } else {
          await updateTrip(
            editing.id,
            stripCollectionsFromMutationInput(mutationInput),
            media,
          );
        }
        setNotice({ type: "success", message: "تم تحديث الرحلة بنجاح" });
      } else {
        await createTrip(mutationInput, media);
        setNotice({ type: "success", message: "تمت إضافة الرحلة بنجاح" });
      }

      setShowModal(false);
      await fetchTrips();
    } catch (err) {
      const raw = err instanceof Error ? err.message : "فشل في حفظ الرحلة";
      const message = /file.*(too large|size)/i.test(raw)
        ? "حجم الملف كبير جداً. يرجى ضغط الصورة أو اختيار صورة أصغر (حد أقصى 2MB)."
        : raw;
      setNotice({ type: "error", message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    try {
      await deleteTrip(deleteId);
      setNotice({ type: "success", message: "تم حذف الرحلة بنجاح" });
      setDeleteId(null);
      await fetchTrips();
    } catch (err) {
      setNotice({
        type: "error",
        message: err instanceof Error ? err.message : "فشل في حذف الرحلة",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const url = form.galleryImages[index];
    if (url?.startsWith("blob:") || url?.startsWith("data:")) {
      // It's a newly uploaded file — remove from newGalleryItems too
      setNewGalleryItems((prev) => prev.filter((item) => item.url !== url));
    } else if (editing && url) {
      // It's an existing API image — mark its assetId for deletion
      const assetIds = editing.imageAssetIdsByUrl[url];
      if (assetIds) {
        setDeleteAssetIds((prev) => [...prev, ...assetIds]);
      }
    }
    setForm((cur) => ({
      ...cur,
      galleryImages: cur.galleryImages.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveHeroImage = () => {
    if (editing && form.heroImage) {
      const assetIds = editing.imageAssetIdsByUrl[form.heroImage];
      if (assetIds) {
        setDeleteAssetIds((prev) => [...prev, ...assetIds]);
      }
    }
    setForm((cur) => ({ ...cur, heroImage: "" }));
    setHeroFile(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
          <p className="text-sm text-[#6B7280] mt-1">جاري تحميل البيانات...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#F3F4F6] p-5 animate-pulse">
              <div className="h-4 bg-[#F3F4F6] rounded w-1/2 mb-3" />
              <div className="h-8 bg-[#F3F4F6] rounded w-1/3" />
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-12">
          <div className="flex items-center justify-center gap-3">
            <svg className="w-6 h-6 text-[#9CA3AF] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-[#6B7280]">جاري تحميل الرحلات...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
        </div>
        <div className="bg-white rounded-2xl border border-[#FEE2E2] p-8 text-center">
          <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-[#111] mb-2">خطأ في التحميل</h3>
          <p className="text-sm text-[#6B7280] mb-4">{error}</p>
          <button onClick={() => { setLoading(true); fetchTrips(); }} className="bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {notice && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          notice.type === "success" ? "bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]" : "bg-[#FEF2F2] text-[#991B1B] border border-[#FECACA]"
        }`}>
          {notice.message}
        </div>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">الرحلات</h1>
          <p className="text-sm text-[#6B7280] mt-1">إدارة الرحلات السياحية — مربوط مع الـ API الحقيقي.</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 bg-[#111] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          إضافة رحلة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">إجمالي الرحلات</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{trips.length}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">محملة من الـ API</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">التهيئات</p>
          <p className="text-3xl font-bold text-[#111] mt-2">{totalOptions + totalAddOns}</p>
          <p className="text-xs text-[#9CA3AF] mt-2">{totalOptions} خيارات حجز + {totalAddOns} إضافات</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#F3F4F6] p-5">
          <p className="text-sm text-[#6B7280]">آخر تحديث</p>
          <p className="text-3xl font-bold text-[#111] mt-2">
            {trips.length > 0
              ? new Date(
                  Math.max(...trips.map((t) => new Date(t.updatedAt).getTime()))
                ).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })
              : "—"}
          </p>
          <p className="text-xs text-[#9CA3AF] mt-2">بيانات حية من السيرفر</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3F4F6] overflow-hidden">
        {trips.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#111] mb-2">لا توجد رحلات بعد</h3>
            <p className="text-sm text-[#6B7280] mb-4">أضف أول رحلة من زر &quot;إضافة رحلة&quot; أعلاه.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-trips-table w-full text-sm min-w-[980px]">
              <thead>
                <tr className="border-b border-[#F3F4F6] bg-[#F9FAFB]">
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الإجراءات</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الصورة</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الرحلة</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">الجدولة</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">السعر</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">المحتوى</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">التهيئة</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#6B7280]">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-[#F9FAFB] hover:bg-[#FAFBFC] transition-colors align-top">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(trip)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors" title="تعديل">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                        </button>
                        <button onClick={() => setDeleteId(trip.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors" title="حذف">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {trip.heroImage ? (
                        <FlexibleImage src={trip.heroImage} alt={trip.titleAr} width={64} height={48} sizes="64px" className="w-16 h-12 rounded-lg object-cover bg-[#F3F4F6]" />
                      ) : (
                        <div className="w-16 h-12 rounded-lg bg-[#F3F4F6] flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#9CA3AF]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <p className="font-medium text-[#111]">{trip.titleAr || "—"}</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-0.5" dir="ltr">{trip.titleEn || "—"}</p>
                      <p className="text-[11px] text-[#6B7280] mt-2" dir="ltr">/{trip.slug}</p>
                    </td>
                    <td className="px-5 py-3 text-[#6B7280]">
                      <p>{trip.schedule.durationAr || "—"}</p>
                      <p className="text-[11px] text-[#9CA3AF] mt-1" dir="ltr">{trip.schedule.startTime || "—"} - {trip.schedule.endTime || "—"}</p>
                    </td>
                    <td className="px-5 py-3 font-semibold text-[#111]">{formatPrice(trip.startingPrice, "ar")}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.galleryImages.length} صور</span>
                        <span className="bg-[#F8FAFC] text-[#475569] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.includesAr.length} يشمل</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-2">
                        {trip.options.length > 0 && <span className="bg-[#F0F9FF] text-[#0EA5E9] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.options.length} خيار</span>}
                        {trip.addOns.length > 0 && <span className="bg-[#F0FDF4] text-[#22C55E] text-[10px] font-medium px-2 py-0.5 rounded-full">{trip.addOns.length} إضافة</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(trip)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111] transition-colors" title="تعديل">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                        </button>
                        <button onClick={() => setDeleteId(trip.id)} className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors" title="حذف">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <style jsx>{`
              .admin-trips-table th:last-child,
              .admin-trips-table td:last-child {
                display: none;
              }
            `}</style>
          </div>
        )}
      </div>

      {/* ── Create/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !saving && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111]">{editing ? "تعديل الرحلة" : "إضافة رحلة جديدة"}</h2>
              <button onClick={() => !saving && setShowModal(false)} className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#6B7280]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المعلومات الأساسية</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالعربي *</label>
                    <input value={form.titleAr} onChange={(e) => setForm({ ...form, titleAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">العنوان بالإنجليزي</label>
                    <input value={form.titleEn} onChange={(e) => setForm({ ...form, titleEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Slug (رابط)</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="trip-name-slug" dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">السعر الابتدائي (ج.م)</label>
                    <input type="number" value={form.startingPrice || ""} onChange={(e) => setForm({ ...form, startingPrice: Number(e.target.value) })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الجملة التعريفية بالعربي</label>
                    <input value={form.taglineAr} onChange={(e) => setForm({ ...form, taglineAr: e.target.value })} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Tagline in English</label>
                    <input value={form.taglineEn} onChange={(e) => setForm({ ...form, taglineEn: e.target.value })} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">الوصف بالعربي</label>
                    <textarea value={form.descriptionAr} onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })} rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">Description in English</label>
                    <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} dir="ltr" rows={5} className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                </div>
              </section>

              {/* Schedule */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الجدولة</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت البداية</label>
                    <input type="time" step={60} required value={form.startTime} onChange={(e) => updateScheduleField("startTime", e.target.value)} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">وقت النهاية</label>
                    <input type="time" step={60} required value={form.endTime} onChange={(e) => updateScheduleField("endTime", e.target.value)} dir="ltr" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">المدة بالعربي</label>
                    <input value={form.durationAr} onChange={(e) => setForm({ ...form, durationAr: e.target.value })} placeholder="8 ساعات" className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                </div>
                <p className="mt-2 text-xs text-[#9CA3AF]">
                  تُحدَّد مدة الرحلة تلقائياً بمجرد اختيار وقت البداية ووقت النهاية.
                </p>
              </section>

              {/* Media */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الوسائط</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">رابط يوتيوب (اختياري)</label>
                    <input
                      value={form.youtubeUrl}
                      onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                      placeholder="https://youtube.com/watch?v=..."
                      dir="ltr"
                      className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors"
                    />
                  </div>
                  <FileUpload
                    label="الصورة الرئيسية (حد أقصى 2MB)"
                    accept="image"
                    value={form.heroImage || undefined}
                    onChange={(url, file) => {
                      if (file.size > MAX_FILE_SIZE) {
                        const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
                        setNotice({ type: "error", message: `حجم الصورة (${sizeMB}MB) كبير جداً. الحد المسموح 2MB.` });
                        return;
                      }
                      setForm((cur) => ({ ...cur, heroImage: url }));
                      setHeroFile(file);
                    }}
                    onClear={handleRemoveHeroImage}
                  />
                  <div>
                    <label className="block text-xs font-medium text-[#374151] mb-1.5">معرض الصور</label>
                    {form.galleryImages.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                        {form.galleryImages.map((image, index) => (
                          <div key={`${image}-${index}`} className="relative h-24 rounded-xl overflow-hidden bg-[#F3F4F6]">
                            <FlexibleImage src={image} alt={`gallery-${index}`} fill sizes="96px" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="absolute top-1 left-1 w-5 h-5 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center text-xs transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <FileUpload
                      key={galleryKey}
                      label="إضافة صورة للمعرض (حد أقصى 2MB)"
                      accept="image"
                      multiple
                      previewHeight="h-24"
                      onFilesChange={appendGalleryImages}
                    />
                  </div>
                </div>
              </section>

              {/* Includes */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">المحتوى</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <StringListSection
                    label="يشمل بالعربي"
                    placeholder="مثال: الانتقالات ذهاب وعودة"
                    items={form.includesAr}
                    onAdd={(value) => setForm((cur) => ({ ...cur, includesAr: [...cur.includesAr, value] }))}
                    onRemove={(index) => setForm((cur) => ({ ...cur, includesAr: cur.includesAr.filter((_, i) => i !== index) }))}
                  />
                  <StringListSection
                    label="Includes in English"
                    placeholder="Round-trip hotel transfers"
                    items={form.includesEn}
                    onAdd={(value) => setForm((cur) => ({ ...cur, includesEn: [...cur.includesEn, value] }))}
                    onRemove={(index) => setForm((cur) => ({ ...cur, includesEn: cur.includesEn.filter((_, i) => i !== index) }))}
                  />
                </div>
              </section>

              {/* Options */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">خيارات الحجز</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={optionInput.nameAr} onChange={(e) => setOptionInput({ ...optionInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={optionInput.nameEn} onChange={(e) => setOptionInput({ ...optionInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <textarea value={optionInput.descriptionAr} onChange={(e) => setOptionInput({ ...optionInput, descriptionAr: e.target.value })} placeholder="وصف الخيار بالعربي" rows={3} className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                    <textarea value={optionInput.descriptionEn} onChange={(e) => setOptionInput({ ...optionInput, descriptionEn: e.target.value })} placeholder="Option description in English" dir="ltr" rows={3} className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors resize-none" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input type="number" value={optionInput.price || ""} onChange={(e) => setOptionInput({ ...optionInput, price: Number(e.target.value) })} placeholder="السعر (ج.م)" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={addOption} className="flex-1 md:flex-none px-4 py-2.5 bg-[#111] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                      {editingOptionIndex !== null ? "حفظ التعديل" : "+ إضافة خيار"}
                    </button>
                    {editingOptionIndex !== null && (
                      <button type="button" onClick={cancelEditOption} className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
                {form.options.length > 0 && (
                  <div className="space-y-2">
                    {form.options.map((option, index) => (
                      <div key={index} className={`flex flex-col gap-2 rounded-xl px-4 py-3 text-sm transition-colors ${editingOptionIndex === index ? "bg-[#EFF6FF] border border-[#BFDBFE]" : "bg-[#F9FAFB]"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#111]">{option.nameAr} <span className="text-[#9CA3AF]" dir="ltr">/ {option.nameEn || "—"}</span></p>
                          </div>
                          <div className="flex items-center gap-2 mr-3">
                            <span className="font-semibold text-[#111] text-xs">{formatPrice(option.price, "ar")}</span>
                            <button type="button" onClick={() => startEditOption(index)} className="p-1 rounded-md text-[#6B7280] hover:bg-white hover:text-[#2563EB] transition-colors" title="تعديل">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                            </button>
                            <button type="button" onClick={() => { if (editingOptionIndex === index) cancelEditOption(); setForm((cur) => ({ ...cur, options: cur.options.filter((_, i) => i !== index) })); }} className="p-1 rounded-md text-[#9CA3AF] hover:bg-white hover:text-[#EF4444] transition-colors" title="حذف">×</button>
                          </div>
                        </div>
                        {option.descriptionAr && (
                          <p className="text-xs text-[#6B7280]">{option.descriptionAr}</p>
                        )}
                        {option.descriptionEn && (
                          <p className="text-xs text-[#9CA3AF]" dir="ltr">{option.descriptionEn}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Add-ons */}
              <section>
                <p className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">الإضافات</p>
                <div className="space-y-2 mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={addOnInput.nameAr} onChange={(e) => setAddOnInput({ ...addOnInput, nameAr: e.target.value })} placeholder="الاسم بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={addOnInput.nameEn} onChange={(e) => setAddOnInput({ ...addOnInput, nameEn: e.target.value })} placeholder="Name in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input value={addOnInput.descriptionAr} onChange={(e) => setAddOnInput({ ...addOnInput, descriptionAr: e.target.value })} placeholder="الوصف بالعربي" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                    <input value={addOnInput.descriptionEn} onChange={(e) => setAddOnInput({ ...addOnInput, descriptionEn: e.target.value })} placeholder="Description in English" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <input type="number" value={addOnInput.price || ""} onChange={(e) => setAddOnInput({ ...addOnInput, price: Number(e.target.value) })} placeholder="السعر (ج.م)" dir="ltr" className="border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111] transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={addAddOn} className="flex-1 md:flex-none px-4 py-2.5 bg-[#111] text-white rounded-xl text-sm font-medium hover:bg-[#333] transition-colors">
                      {editingAddOnIndex !== null ? "حفظ التعديل" : "+ إضافة"}
                    </button>
                    {editingAddOnIndex !== null && (
                      <button type="button" onClick={cancelEditAddOn} className="px-4 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors">
                        إلغاء
                      </button>
                    )}
                  </div>
                </div>
                {form.addOns.length > 0 && (
                  <div className="space-y-2">
                    {form.addOns.map((addOn, index) => (
                      <div key={index} className={`rounded-xl px-4 py-3 text-sm transition-colors ${editingAddOnIndex === index ? "bg-[#EFF6FF] border border-[#BFDBFE]" : "bg-[#F9FAFB]"}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-[#111]">{addOn.nameAr} <span className="text-[#9CA3AF]" dir="ltr">/ {addOn.nameEn || "—"}</span></p>
                          </div>
                          <div className="flex items-center gap-2 mr-3">
                            <span className="font-semibold text-[#111] text-xs">{formatPrice(addOn.price, "ar")}</span>
                            <button type="button" onClick={() => startEditAddOn(index)} className="p-1 rounded-md text-[#6B7280] hover:bg-white hover:text-[#2563EB] transition-colors" title="تعديل">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z" /></svg>
                            </button>
                            <button type="button" onClick={() => { if (editingAddOnIndex === index) cancelEditAddOn(); setForm((cur) => ({ ...cur, addOns: cur.addOns.filter((_, i) => i !== index) })); }} className="p-1 rounded-md text-[#9CA3AF] hover:bg-white hover:text-[#EF4444] transition-colors" title="حذف">×</button>
                          </div>
                        </div>
                        {addOn.descriptionAr && (
                          <p className="text-xs text-[#6B7280] mt-1">{addOn.descriptionAr}</p>
                        )}
                        {addOn.descriptionEn && (
                          <p className="text-xs text-[#9CA3AF] mt-0.5" dir="ltr">{addOn.descriptionEn}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-[#F3F4F6]">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#111] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? "جاري الحفظ..." : editing ? "حفظ التعديلات" : "إضافة الرحلة"}
              </button>
              <button onClick={() => !saving && setShowModal(false)} disabled={saving} className="px-5 py-2.5 border border-[#E5E7EB] rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50">إلغاء</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => !deleting && setDeleteId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-[#FEF2F2] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-[#111] mb-2">حذف الرحلة؟</h3>
            <p className="text-sm text-[#6B7280] mb-6">سيتم حذف هذه الرحلة نهائياً من السيرفر.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-[#EF4444] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#DC2626] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {deleting ? "جاري الحذف..." : "نعم، احذف"}
              </button>
              <button onClick={() => !deleting && setDeleteId(null)} disabled={deleting} className="flex-1 border border-[#E5E7EB] py-2.5 rounded-xl text-sm text-[#6B7280] hover:bg-[#F3F4F6] transition-colors disabled:opacity-50">إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
