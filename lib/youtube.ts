export function extractYouTubeVideoId(url: string) {
  if (!url) return "";

  const normalizedUrl = url.trim();
  const directIdPattern = /^[A-Za-z0-9_-]{11}$/;
  if (directIdPattern.test(normalizedUrl)) {
    return normalizedUrl;
  }

  try {
    const parsed = new URL(normalizedUrl);
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      const id = parsed.pathname.replace(/\//g, "");
      return directIdPattern.test(id) ? id : "";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      const pathnameParts = parsed.pathname.split("/").filter(Boolean);

      if (pathnameParts[0] === "watch") {
        const id = parsed.searchParams.get("v") ?? "";
        return directIdPattern.test(id) ? id : "";
      }

      if (pathnameParts[0] === "embed" || pathnameParts[0] === "shorts") {
        const id = pathnameParts[1] ?? "";
        return directIdPattern.test(id) ? id : "";
      }
    }
  } catch {
    return "";
  }

  return "";
}

export function toYouTubeEmbedUrl(url: string) {
  if (!url) return "";

  const videoId = extractYouTubeVideoId(url);
  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : "";
}

export function isYouTubeShortUrl(url: string) {
  if (!url) return false;

  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.replace(/^www\./, "");

    if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
      return false;
    }

    const pathnameParts = parsed.pathname.split("/").filter(Boolean);
    return pathnameParts[0] === "shorts";
  } catch {
    return false;
  }
}
