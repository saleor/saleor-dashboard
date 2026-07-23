export type ProductMediaFileValidationReason = "invalidType";

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

/**
 * Client-side checks that do not depend on backend configuration.
 *
 * File size is intentionally not validated here: Core enforces
 * `MAX_IMAGE_FILE_SIZE` (env-configurable; Cloud sandboxes/prod differ),
 * and that limit is not exposed via the Shop API.
 */
export const validateProductMediaFiles = (
  files: FileList | File[],
): ProductMediaFileValidationResult => {
  const validFiles: File[] = [];
  const rejected: ProductMediaFileValidationResult["rejected"] = [];

  Array.from(files).forEach(file => {
    if (!isImageFile(file)) {
      rejected.push({ file, reason: "invalidType" });

      return;
    }

    validFiles.push(file);
  });

  return { validFiles, rejected };
};
