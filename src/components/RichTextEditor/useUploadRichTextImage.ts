import { useFileUploadMutation } from "@dashboard/graphql";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { errorMessages } from "@dashboard/intl";
import { useCallback } from "react";
import { defineMessages, useIntl } from "react-intl";

export const MAX_RICH_TEXT_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Matches the image formats accepted by Saleor Core's media upload.
// SVG is intentionally excluded - it can carry inline scripts (XSS) when rendered.
export const ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES = [
  "image/avif",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/tiff",
  "image/webp",
];

export type RichTextImageValidationError = "invalidType" | "tooLarge";

export const validateRichTextImage = (file: Blob): RichTextImageValidationError | null => {
  if (!ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES.includes(file.type)) {
    return "invalidType";
  }

  if (file.size > MAX_RICH_TEXT_IMAGE_SIZE_BYTES) {
    return "tooLarge";
  }

  return null;
};

/** Response shape expected by @editorjs/image's `uploader.uploadByFile`. */
export interface EditorJsUploadResponse {
  success: 0 | 1;
  file: { url: string };
}

export type UploadRichTextImage = (file: Blob) => Promise<EditorJsUploadResponse>;

const failureResponse: EditorJsUploadResponse = { success: 0, file: { url: "" } };

const messages = defineMessages({
  invalidType: {
    id: "BngYqa",
    defaultMessage:
      "Unsupported image format. Allowed formats: AVIF, BMP, GIF, JPEG, PNG, TIFF, WEBP.",
  },
  tooLarge: {
    id: "QVz0PI",
    defaultMessage: "Image is too large. Maximum size is {maxSize} MB.",
  },
});

/**
 * Adapts Saleor's generic `fileUpload` mutation to the uploader contract expected
 * by @editorjs/image. Validates type/size client-side, surfaces failures both via
 * the returned `success: 0` (handled inline by the editor block) and a notifier
 * toast, matching how the rest of the dashboard reports mutation errors.
 */
export const useUploadRichTextImage = (): UploadRichTextImage => {
  const notify = useNotifier();
  const intl = useIntl();
  const [uploadFile] = useFileUploadMutation({});

  return useCallback(
    async (file: Blob) => {
      const validationError = validateRichTextImage(file);

      if (validationError) {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text:
            validationError === "tooLarge"
              ? intl.formatMessage(messages.tooLarge, {
                  maxSize: MAX_RICH_TEXT_IMAGE_SIZE_BYTES / (1024 * 1024),
                })
              : intl.formatMessage(messages.invalidType),
        });

        return failureResponse;
      }

      try {
        const { data } = await uploadFile({ variables: { file } });
        const url = data?.fileUpload?.uploadedFile?.url;

        if (data?.fileUpload?.errors?.length || !url) {
          notify({
            status: "error",
            title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
            text: intl.formatMessage(errorMessages.imageUploadErrorText),
          });

          return failureResponse;
        }

        return { success: 1, file: { url } };
      } catch {
        notify({
          status: "error",
          title: intl.formatMessage(errorMessages.imgageUploadErrorTitle),
          text: intl.formatMessage(errorMessages.imageUploadErrorText),
        });

        return failureResponse;
      }
    },
    [uploadFile, notify, intl],
  );
};
