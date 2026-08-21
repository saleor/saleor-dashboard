import { createContext, useContext } from "react";

import { type UploadRichTextImage } from "./useUploadRichTextImage";

/**
 * Lets callers override how rich text images are uploaded. When no provider is
 * present (the default in the app), `RichTextEditor` falls back to the real
 * `useUploadRichTextImage` hook wired to Saleor's `fileUpload` mutation.
 *
 * Useful for Storybook/tests where uploading to a real backend is undesirable -
 * e.g. an in-memory uploader that returns a base64 data URL.
 */
export const RichTextImageUploadContext = createContext<UploadRichTextImage | null>(null);

export const useRichTextImageUploadOverride = (): UploadRichTextImage | null =>
  useContext(RichTextImageUploadContext);
