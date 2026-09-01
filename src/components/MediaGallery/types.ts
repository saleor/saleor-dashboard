/**
 * Minimal shape the gallery needs from a media object. Deliberately structural so the same
 * gallery renders `ProductMedia` (main schema) and the generic `Media` types (3.24+), whose
 * media-type field is named differently.
 */
export interface GalleryMedia {
  id: string;
  alt: string | null;
  url: string;
  type?: string | null;
  oembedData?: string | null;
  sortOrder?: number | null;
}
