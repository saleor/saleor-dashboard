// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import { type PasteConfig, type ToolConstructable, type ToolSettings } from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import createGenericInlineTool from "editorjs-inline-tool";

const inlineToolbar = ["link", "bold", "italic", "strikethrough"];

// The plugin types mark `uploadUrl` private, but it is the tool's own entry point
// for filling a block from a URL (shows the preloader, then stores the result).
interface ImageToolInternals {
  uploadUrl(url: string): void;
}

// Editor.js renders its own UI in English (toolbox names, tunes, error toasts), so
// these follow suit rather than being the only translated strings in the editor.
const ADD_BY_LINK_LABEL = "Add image by link";
const ADD_BY_LINK_PROMPT = "Paste a link to an image";

/**
 * Uploading images to Saleor media storage is not wired up yet, so the image tool
 * is restricted to externally hosted images: pasted as a link (or as HTML with an
 * `<img>`), or entered through the toolbox. Existing image blocks still render.
 */
class ExternalImage extends Image {
  // Drop the drag-n-drop / clipboard file handlers - without an uploader they can
  // only fail. URL and <img> paste handling stays.
  static get pasteConfig(): PasteConfig {
    const inherited: Exclude<PasteConfig, false> = super.pasteConfig || {};

    return { tags: inherited.tags, patterns: inherited.patterns };
  }

  // Both entry points into the empty block (the toolbox item and the button inside
  // it) ask for a URL. The base implementation opens a file picker instead.
  // ponytail: window.prompt keeps this to a few lines while uploads are disabled;
  // replace it with a proper inline URL field if this outlives the missing API.
  askForUrl(): void {
    const url = window.prompt(ADD_BY_LINK_PROMPT);

    if (url) {
      (this as unknown as ImageToolInternals).uploadUrl(url.trim());
    }
  }

  // Fires when the image tool is picked from the "+" toolbox.
  appendCallback(): void {
    this.askForUrl();
  }

  render(): HTMLDivElement {
    const wrapper = super.render();
    // Swap the plugin's "Select an Image" button - cloning it drops the built-in
    // click listener that opens the file picker.
    const fileButton = wrapper.querySelector(".cdx-button");
    const linkButton = fileButton?.cloneNode(true);

    if (fileButton && linkButton) {
      linkButton.addEventListener("click", () => this.askForUrl());
      fileButton.replaceWith(linkButton);
    }

    return wrapper;
  }
}

const rejectUpload = async () => ({ success: 0, file: { url: "" } });

// Stores the pasted URL as-is. data:/blob: sources are rejected - they would inline
// the whole file into the saved rich text instead of referencing a hosted image.
const acceptExternalUrl = async (url: string) =>
  /^https?:\/\//i.test(url) ? { success: 1, file: { url } } : rejectUpload();

export const tools: Record<string, ToolConstructable | ToolSettings> = {
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
    class: ExternalImage,
    config: {
      buttonContent: ADD_BY_LINK_LABEL,
      uploader: {
        uploadByUrl: acceptExternalUrl,
        // Without this the tool falls back to POSTing the file to an undefined endpoint.
        uploadByFile: rejectUpload,
      },
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
};
