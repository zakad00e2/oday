"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import FlexibleImage from "@/components/FlexibleImage";

const controlClassName = "absolute z-10 grid size-11 cursor-pointer place-items-center rounded-full border border-white/30 bg-black/50 text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function HotelPhotoViewer({
    photos,
    index,
    hotelName,
    isAr,
    labels,
    onSelect,
    onClose,
}: {
    photos: string[];
    index: number;
    hotelName: string;
    isAr: boolean;
    labels: { hotelGallery: string; image: string; previousPhoto: string; nextPhoto: string; closePhotos: string };
    onSelect: (photo: string) => void;
    onClose: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const canNavigate = photos.length > 1;
    const PreviousIcon = isAr ? ChevronRight : ChevronLeft;
    const NextIcon = isAr ? ChevronLeft : ChevronRight;

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (!dialog.open) dialog.showModal();

        const root = document.documentElement;
        const previousOverflow = root.style.overflow;
        root.style.overflow = "hidden";
        return () => { root.style.overflow = previousOverflow; };
    }, []);

    const move = (step: number) => onSelect(photos[(index + step + photos.length) % photos.length]);

    return (
        <dialog
            ref={dialogRef}
            dir={isAr ? "rtl" : "ltr"}
            aria-label={labels.hotelGallery}
            onClose={onClose}
            onClick={(event) => {
                if (event.target === event.currentTarget) event.currentTarget.close();
            }}
            onKeyDown={(event) => {
                if (!canNavigate || (event.key !== "ArrowLeft" && event.key !== "ArrowRight")) return;
                event.preventDefault();
                move((event.key === "ArrowLeft") === isAr ? 1 : -1);
            }}
            data-lenis-prevent
            className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none place-items-center overflow-hidden bg-transparent text-white backdrop:bg-black/90 open:grid"
        >
            <button
                type="button"
                aria-label={labels.closePhotos}
                onClick={() => dialogRef.current?.close()}
                className={`${controlClassName} end-4 top-4 sm:end-6 sm:top-6`}
            >
                <X size={23} aria-hidden="true" />
            </button>

            {canNavigate && (
                <>
                    <button
                        type="button"
                        aria-label={labels.previousPhoto}
                        onClick={() => move(-1)}
                        className={`${controlClassName} start-2 top-1/2 -translate-y-1/2 sm:start-6`}
                    >
                        <PreviousIcon size={25} aria-hidden="true" />
                    </button>
                    <button
                        type="button"
                        aria-label={labels.nextPhoto}
                        onClick={() => move(1)}
                        className={`${controlClassName} end-2 top-1/2 -translate-y-1/2 sm:end-6`}
                    >
                        <NextIcon size={25} aria-hidden="true" />
                    </button>
                </>
            )}

            <FlexibleImage
                src={photos[index]}
                alt={`${hotelName} - ${labels.image} ${index + 1}`}
                width={1600}
                height={1200}
                sizes="(max-width: 767px) calc(100vw - 1rem), calc(100vw - 12rem)"
                loading="eager"
                className="size-auto max-h-[calc(100dvh-8rem)] max-w-[calc(100%-1rem)] rounded-lg object-contain md:max-w-[calc(100%-12rem)]"
            />

            {canNavigate && (
                <p dir="ltr" aria-live="polite" className="absolute bottom-5 rounded-full bg-black/60 px-3 py-1 text-sm tabular-nums text-white">
                    {index + 1} / {photos.length}
                </p>
            )}
        </dialog>
    );
}
