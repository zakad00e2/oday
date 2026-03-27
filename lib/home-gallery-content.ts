export const HOME_GALLERY_STORAGE_KEY = "oday-home-gallery-content";
export const HOME_GALLERY_UPDATED_EVENT = "oday-home-gallery-updated";

export interface HomeGalleryImage {
  id: string;
  image: string;
}

export interface HomeGalleryContent {
  packagesGallery: HomeGalleryImage[];
  showcaseGallery: HomeGalleryImage[];
}

export const defaultHomeGalleryContent: HomeGalleryContent = {
  packagesGallery: [
    { id: "package-1", image: "/optimized/package-card.webp" },
    { id: "package-2", image: "/optimized/package-card.webp" },
    { id: "package-3", image: "/optimized/package-card.webp" },
    { id: "package-4", image: "/optimized/package-card.webp" },
  ],
  showcaseGallery: [
    { id: "showcase-1", image: "/optimized/gallery-1.webp" },
    { id: "showcase-2", image: "/optimized/gallery-2.webp" },
    { id: "showcase-3", image: "/optimized/gallery-3.webp" },
    { id: "showcase-4", image: "/optimized/gallery-4.webp" },
    { id: "showcase-5", image: "/optimized/gallery-5.webp" },
    { id: "showcase-6", image: "/optimized/gallery-6.webp" },
    { id: "showcase-7", image: "/optimized/gallery-7.webp" },
    { id: "showcase-8", image: "/optimized/gallery-8.webp" },
    { id: "showcase-9", image: "/optimized/gallery-9.webp" },
  ],
};

function normalizeGalleryImage(
  image: Partial<HomeGalleryImage> | undefined,
  index: number,
  prefix: string,
  fallbackImage = "",
): HomeGalleryImage {
  return {
    id: typeof image?.id === "string" && image.id.trim() ? image.id : `${prefix}-${index + 1}`,
    image: typeof image?.image === "string" ? image.image : fallbackImage,
  };
}

export function cloneHomeGalleryContent(content: HomeGalleryContent = defaultHomeGalleryContent): HomeGalleryContent {
  return {
    packagesGallery: content.packagesGallery.map((image, index) =>
      normalizeGalleryImage(
        image,
        index,
        "package",
        defaultHomeGalleryContent.packagesGallery[index]?.image || defaultHomeGalleryContent.packagesGallery[0]?.image || "",
      ),
    ),
    showcaseGallery: content.showcaseGallery.map((image, index) =>
      normalizeGalleryImage(
        image,
        index,
        "showcase",
        defaultHomeGalleryContent.showcaseGallery[index]?.image || defaultHomeGalleryContent.showcaseGallery[0]?.image || "",
      ),
    ),
  };
}

export function normalizeHomeGalleryContent(content?: Partial<HomeGalleryContent> | null): HomeGalleryContent {
  const packagesGallery = Array.isArray(content?.packagesGallery)
    ? content.packagesGallery
    : defaultHomeGalleryContent.packagesGallery;
  const showcaseGallery = Array.isArray(content?.showcaseGallery)
    ? content.showcaseGallery
    : defaultHomeGalleryContent.showcaseGallery;

  return {
    packagesGallery: packagesGallery.map((image, index) =>
      normalizeGalleryImage(
        image,
        index,
        "package",
        defaultHomeGalleryContent.packagesGallery[index]?.image || defaultHomeGalleryContent.packagesGallery[0]?.image || "",
      ),
    ),
    showcaseGallery: showcaseGallery.map((image, index) =>
      normalizeGalleryImage(
        image,
        index,
        "showcase",
        defaultHomeGalleryContent.showcaseGallery[index]?.image || defaultHomeGalleryContent.showcaseGallery[0]?.image || "",
      ),
    ),
  };
}

export function readHomeGalleryContent(): HomeGalleryContent {
  if (typeof window === "undefined") {
    return cloneHomeGalleryContent();
  }

  try {
    const stored = window.localStorage.getItem(HOME_GALLERY_STORAGE_KEY);

    if (!stored) {
      return cloneHomeGalleryContent();
    }

    return normalizeHomeGalleryContent(JSON.parse(stored) as Partial<HomeGalleryContent>);
  } catch {
    return cloneHomeGalleryContent();
  }
}

export function saveHomeGalleryContent(content: HomeGalleryContent) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(HOME_GALLERY_STORAGE_KEY, JSON.stringify(normalizeHomeGalleryContent(content)));
  window.dispatchEvent(new Event(HOME_GALLERY_UPDATED_EVENT));
}
