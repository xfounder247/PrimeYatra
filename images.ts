import { esc } from './lib/html';
import { ART_W, ART_H } from './art';

/**
 * Destination images. By default each destination uses its generated illustration.
 * If a real photo exists at public/images/destinations/<slug>.(jpg|jpeg|png|webp),
 * build.ts resizes it and registers it here so every card and hero picks it up.
 */
export type Photo = { src: string; srcset: string; width: number; height: number };

const photos = new Map<string, Photo>();

export function registerPhoto(slug: string, photo: Photo): void {
  photos.set(slug, photo);
}

export function hasPhoto(slug: string): boolean {
  return photos.has(slug);
}

export function artUrl(slug: string): string {
  return `/assets/art/${slug}.svg`;
}

export type ImgOptions = { cls?: string; sizes?: string; priority?: boolean; alt?: string };

export function destImg(slug: string, label: string, o: ImgOptions = {}): string {
  const photo = photos.get(slug);
  const loading = o.priority ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  const cls = esc(o.cls ?? 'h-full w-full object-cover');
  if (photo) {
    return `<img src="${photo.src}" srcset="${photo.srcset}" sizes="${esc(o.sizes ?? '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw')}" width="${photo.width}" height="${photo.height}" alt="${esc(o.alt ?? label)}" ${loading} decoding="async" class="${cls}" />`;
  }
  // Illustration: decorative, the heading next to it carries the meaning.
  return `<img src="${artUrl(slug)}" width="${ART_W}" height="${ART_H}" alt="" ${loading} decoding="async" class="${cls}" />`;
}
