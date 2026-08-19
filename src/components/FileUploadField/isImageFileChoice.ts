import { type FileFragment } from "@dashboard/graphql";

/** Prefer MIME type from the API; fall back to URL extension when contentType is missing. */
export const isImageFileChoice = (file?: FileFragment | null): boolean => {
  if (!file?.url) {
    return false;
  }

  if (file.contentType?.startsWith("image/")) {
    return true;
  }

  if (file.contentType) {
    return false;
  }

  return /\.(avif|bmp|gif|jpe?g|png|webp)(\?|#|$)/i.test(file.url);
};
