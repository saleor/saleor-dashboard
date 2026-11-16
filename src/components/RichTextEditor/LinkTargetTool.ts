import { type API, type InlineTool, type PopoverItemSeparatorParams } from "@editorjs/editorjs";

// lucide "external-link" (ISC); the wider viewBox matches the padding of Editor.js's own icons.
const OpenInNewTabIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="-3 -3 30 30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>`;

// PopoverItemType only exists in Editor.js's type declarations; its bundle exports just
// the EditorJS class, so the enum's value is written out here.
const separator = { type: "separator" } as PopoverItemSeparatorParams;

/**
 * Toggles `target="_blank"` on the link under the selection. Links themselves are
 * created by Editor.js's built-in `link` tool, whose sanitizer already keeps
 * `target="_blank"`, so this tool needs no sanitize rules of its own.
 */
export class LinkTargetTool implements InlineTool {
  static isInline = true;

  static title = "Open in new tab";

  private readonly api: API;

  constructor({ api }: { api: API }) {
    this.api = api;
  }

  // Editor.js creates a fresh instance every time the inline toolbar opens, so the
  // link under the selection is read once here. The separator closes the link group
  // (link, open in new tab) off from the text formatting tools that follow.
  render(): ReturnType<InlineTool["render"]> {
    const link = this.api.selection.findParentTag("A");

    const toggleItem = {
      icon: OpenInNewTabIcon,
      isActive: link?.getAttribute("target") === "_blank",
      isDisabled: !link,
      toggle: true,
      onActivate: (): void => {
        if (!link) {
          return;
        }

        if (link.getAttribute("target") === "_blank") {
          link.removeAttribute("target");
        } else {
          link.setAttribute("target", "_blank");
        }
      },
    };

    return [toggleItem, separator];
  }
}
