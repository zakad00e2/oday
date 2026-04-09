export function openExternalUrl(url: string): boolean {
  if (typeof window === "undefined") return false;

  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (openedWindow) {
    openedWindow.opener = null;
    return true;
  }

  return false;
}
