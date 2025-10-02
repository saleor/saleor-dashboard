// @ts-strict-ignore
import { StrikethroughIcon } from "@dashboard/icons/StrikethroughIcon";
import { ToolConstructable, ToolSettings } from "@editorjs/editorjs";
import EmbedClass from "@editorjs/embed";
import HeaderClass from "@editorjs/header";
import ListClass from "@editorjs/list";
import ParagraphClass from "@editorjs/paragraph";
import QuoteClass from "@editorjs/quote";
import createGenericInlineTool from "editorjs-inline-tool";

const inlineToolbar = ["link", "bold", "italic", "strikethrough"];

export const tools: Record<string, ToolConstructable | ToolSettings> = {
  embed: EmbedClass,
  header: {
    class: HeaderClass,
    config: {
      defaultLevel: 1,
      levels: [1, 2, 3],
    },
    inlineToolbar,
  },
  list: ListClass,
  quote: QuoteClass,
  paragraph: ParagraphClass,
  strikethrough: createGenericInlineTool({
    sanitize: {
      s: {},
    },
    shortcut: "CMD+S",
    tagName: "s",
    toolboxIcon: StrikethroughIcon,
  }),
};
