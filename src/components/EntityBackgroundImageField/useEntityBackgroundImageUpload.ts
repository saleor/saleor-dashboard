import { useCallback, useEffect, useRef, useState } from "react";

interface RunImageMutationArgs {
  /** File being uploaded, or `null` when deleting the saved image. */
  file: File | null;
  /** Return `true` when the mutation succeeded (no GraphQL errors). */
  mutate: () => Promise<boolean>;
}

interface UseEntityBackgroundImageUploadResult {
  backgroundImageRevision: number;
  backgroundImageUploadPreview: string | null;
  isBackgroundImageUploading: boolean;
  onBackgroundImageUploadPreviewLoaded: () => void;
  runImageMutation: (args: RunImageMutationArgs) => Promise<boolean>;
}

/**
 * Blob preview + cache-bust revision for immediate entity background image
 * upload/delete (collections, categories, …). Keep the blob until the saved
 * URL paints so the tile does not flash empty between mutation and refetch.
 */
export const useEntityBackgroundImageUpload = (): UseEntityBackgroundImageUploadResult => {
  const [backgroundImageRevision, setBackgroundImageRevision] = useState(0);
  const [backgroundImageUploadPreview, setBackgroundImageUploadPreview] = useState<string | null>(
    null,
  );
  const [isBackgroundImageUploading, setIsBackgroundImageUploading] = useState(false);
  const backgroundImageUploadPreviewRef = useRef<string | null>(null);

  useEffect(
    function syncBackgroundImageUploadPreviewRef() {
      backgroundImageUploadPreviewRef.current = backgroundImageUploadPreview;
    },
    [backgroundImageUploadPreview],
  );

  useEffect(function revokeBackgroundImageUploadPreviewOnUnmount() {
    return (): void => {
      const previewUrl = backgroundImageUploadPreviewRef.current;

      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const onBackgroundImageUploadPreviewLoaded = useCallback((): void => {
    setBackgroundImageUploadPreview(current => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
  }, []);

  const runImageMutation = useCallback(
    async ({ file, mutate }: RunImageMutationArgs): Promise<boolean> => {
      const uploadPreviewUrl = file ? URL.createObjectURL(file) : null;
      let uploadSucceeded = false;

      if (uploadPreviewUrl) {
        setBackgroundImageUploadPreview(uploadPreviewUrl);
        setIsBackgroundImageUploading(true);
      }

      try {
        const succeeded = await mutate();

        if (succeeded) {
          if (file) {
            setBackgroundImageRevision(revision => revision + 1);
            uploadSucceeded = true;
          }

          return true;
        }

        return false;
      } finally {
        if (uploadPreviewUrl) {
          setIsBackgroundImageUploading(false);

          if (!uploadSucceeded) {
            URL.revokeObjectURL(uploadPreviewUrl);
            setBackgroundImageUploadPreview(null);
          }
        }
      }
    },
    [],
  );

  return {
    backgroundImageRevision,
    backgroundImageUploadPreview,
    isBackgroundImageUploading,
    onBackgroundImageUploadPreviewLoaded,
    runImageMutation,
  };
};
