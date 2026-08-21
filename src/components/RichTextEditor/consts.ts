// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import { type ToolConstructable, type ToolSettings } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import createGenericInlineTool from "editorjs-inline-tool";

import {
  ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES,
  type UploadRichTextImage,
} from "./useUploadRichTextImage";

const inlineToolbar = ["link", "bold", "italic", "strikethrough"];

// Used in read-only contexts so existing image blocks still render, while any
// upload attempt (which shouldn't happen in read-only) safely fails.
const rejectUpload: UploadRichTextImage = async () => ({ success: 0, file: { url: "" } });

export interface GetToolsOpts {
  /**
   * Uploader wired to Saleor's `fileUpload` mutation. Omit in read-only contexts -
   * the image tool is still registered (so saved image blocks render), but new
   * uploads are rejected.
   */
  uploadImage?: UploadRichTextImage;
}

export const getTools = ({ uploadImage }: GetToolsOpts = {}): Record<
  string,
  ToolConstructable | ToolSettings
> => ({
  embed: Embed,
  header: {
    class: Header,
    config: {
      defaultLevel: 1,
      levels: [1, 2, 3],
    },
    inlineToolbar,
  },
  list: {
    class: List,
    inlineToolbar,
  },
  quote: {
    class: Quote,
    inlineToolbar,
  },
  table: {
    // @ts-expect-error Type mismatch between editorjs libraries (@editorjs/table and @editorjs/editorjs)
    class: Table,
    inlineToolbar,
    config: {
      rows: 2,
      cols: 2,
    },
  },
  paragraph: {
    // @ts-expect-error Type mismatch between editorjs libraries (@editorjs/list and @editorjs/editorjs)
    class: Paragraph,
    inlineToolbar,
  },
  image: {
    class: Image,
    config: {
      // Only `uploadByFile` is provided (no `uploadByUrl`) so all images are
      // uploaded through Saleor's media storage rather than hotlinked.
      uploader: {
        uploadByFile: uploadImage ?? rejectUpload,
      },
      types: ALLOWED_RICH_TEXT_IMAGE_MIME_TYPES.join(", "),
    },
  },
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {},
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: StrikethroughIcon,
  }),
});
