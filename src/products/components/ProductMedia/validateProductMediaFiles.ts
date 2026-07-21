/** Matches Saleor's common Django `FILE_UPLOAD_MAX_MEMORY_SIZE` default (10 MiB). */
export const PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export type ProductMediaFileValidationReason = "invalidType" | "tooLarge";

export interface ProductMediaFileValidationResult {
  validFiles: File[];
  rejected: Array<{ file: File; reason: ProductMediaFileValidationReason }>;
}

const isImageFile = (file: File): boolean => {
  if (file.type.startsWith("image/")) {
    return true;
  }

  // Some browsers leave type empty for certain picks; fall back to extension.
  return /\.(avif|bmp|gif|jpe?g|png|webp)$/i.test(file.name);
};

export const validateProductMediaFiles = (
  files: FileList | File[],
  maxSizeBytes: number = PRODUCT_MEDIA_MAX_FILE_SIZE_BYTES,
): ProductMediaFileValidationResult => {
  const validFiles: File[] = [];
  const rejected: ProductMediaFileValidationResult["rejected"] = [];

  Array.from(files).forEach(file => {
    if (!isImageFile(file)) {
      rejected.push({ file, reason: "invalidType" });

      return;
    }

    if (file.size > maxSizeBytes) {
      rejected.push({ file, reason: "tooLarge" });

      return;
    }

    validFiles.push(file);
  });

  return { validFiles, rejected };
};
