/**
 * Bulletproof Image URL Resolver & Error Handler for MegaMart Web & Android APK
 */

export function getProductImageUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return url.startsWith('/') ? url : `/${url}`;
}

export function handleImageErrorFallback(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  originalUrl?: string,
  onFailed?: () => void
) {
  const target = e.currentTarget;
  if (!originalUrl) {
    onFailed?.();
    return;
  }

  // If loading from local relative path failed, try loading from configured remote API server origin
  try {
    const customApi = typeof window !== 'undefined' ? localStorage.getItem('megamart_api_url') : null;
    if (customApi) {
      const serverOrigin = new URL(customApi).origin;
      const cleanPath = originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`;
      const candidateUrl = `${serverOrigin}${cleanPath}`;
      if (target.src !== candidateUrl) {
        target.src = candidateUrl;
        return;
      }
    }
  } catch (err) {
    // ignore
  }

  onFailed?.();
}
