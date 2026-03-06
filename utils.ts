import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const trackEvent = async (eventType: string, pagePath: string, productId?: number) => {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        page_path: pagePath,
        product_id: productId,
        referrer: document.referrer
      })
    });
  } catch (e) {
    console.error('Analytics error:', e);
  }
};

export function getSafeTimestamp(dateStr?: string): number {
  if (!dateStr) return Date.now();
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? Date.now() : date.getTime();
}

export function getProductImageUrl(url: string | undefined, updatedAt?: string, createdAt?: string): string {
  if (!url) return 'https://picsum.photos/seed/placeholder/800/600';
  return url;
}
