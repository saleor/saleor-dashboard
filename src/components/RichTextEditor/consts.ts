// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import {
  type API,
  type PasteConfig,
  type ToolboxConfig,
  type ToolConstructable,
  type ToolSettings,
} from "@editorjs/editorjs";
import Embed, { type EmbedData } from "@editorjs/embed";
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
const EMBED_TITLE = "Embed";
const ADD_EMBED_LABEL = "Add embed by link";
const ADD_EMBED_PROMPT =
  "Paste a link to a YouTube or Vimeo video, a post, or another embeddable page";
const UNSUPPORTED_EMBED_MESSAGE = "This link can't be embedded";

// Icon copied from https://github.com/codex-team/icons (IconPlay), like the other editor.js icons.
const EmbedIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-width="2" d="M10 10.5606V13.4394C10 14.4777 11.1572 15.0971 12.0211 14.5211L14.1803 13.0817C14.9536 12.5661 14.9503 11.4317 14.18 10.9181L12.0214 9.47907C11.1591 8.9042 10 9.5203 10 10.5606Z"/><rect width="14" height="14" x="5" y="5" stroke="currentColor" stroke-width="2" rx="4"/></svg>`;

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

/**
 * The embed plugin only reacts to links pasted into the editor and has no toolbox
 * entry. This adds one: it asks for a link and fills the block the same way a paste
 * would, so the saved data is identical.
 */
class LinkEmbed extends Embed {
  private readonly editorApi: API;

  private readonly isReadOnly: boolean;

  constructor(args: ConstructorParameters<typeof Embed>[0]) {
    super(args);
    this.editorApi = args.api;
    this.isReadOnly = args.readOnly;
  }

  static get toolbox(): ToolboxConfig {
    return { title: EMBED_TITLE, icon: EmbedIcon };
  }

  askForUrl(): void {
    const url = window.prompt(ADD_EMBED_PROMPT)?.trim();

    if (!url) {
      return;
    }

    const service = Object.keys(Embed.patterns).find(key => Embed.patterns[key].test(url));

    if (!service) {
      this.editorApi.notifier.show({ message: UNSUPPORTED_EMBED_MESSAGE, style: "error" });

      return;
    }

    this.onPaste({ detail: { key: service, data: url } });
  }

  // Fires when the tool is picked from the "+" toolbox.
  appendCallback(): void {
    this.askForUrl();
  }

  render(): HTMLElement {
    const element = super.render();

    // The base tool renders an empty element until it has a link. Put a button in
    // it, so a cancelled prompt doesn't leave an invisible block behind.
    if (!this.data.service && !this.isReadOnly) {
      const button = document.createElement("div");

      button.classList.add(this.editorApi.styles.button);
      button.textContent = ADD_EMBED_LABEL;
      button.addEventListener("click", () => this.askForUrl());
      element.appendChild(button);
    }

    return element;
  }

  // Drops blocks that never got a link, instead of saving an empty embed.
  validate(data: EmbedData): boolean {
    return Boolean(data.service);
  }
}

const rejectUpload = async () => ({ success: 0, file: { url: "" } });

// Stores the pasted URL as-is. data:/blob: sources are rejected - they would inline
// the whole file into the saved rich text instead of referencing a hosted image.
const acceptExternalUrl = async (url: string) =>
  /^https?:\/\//i.test(url) ? { success: 1, file: { url } } : rejectUpload();

export const tools: Record<string, ToolConstructable | ToolSettings> = {
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
  embed: LinkEmbed,
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {},
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: StrikethroughIcon,
  }),
};
