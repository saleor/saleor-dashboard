import { OutputBlockData, OutputData } from "@editorjs/editorjs";

interface ListBlockDataNew {
  style: "ordered" | "unordered";
  meta?: Record<string, unknown>;
  items: Array<{
    content: string;
    meta?: Record<string, unknown>;
    items?: unknown[];
  }>;
}

interface ListBlockDataOld {
  style: "ordered" | "unordered";
  items: string[];
}

/**
 * Converts EditorJS list blocks from new format to legacy format for backward compatibility.
 *
 * @editorjs/list v2.0.0+ uses a new format where list items are objects with content and metadata.
 * This function converts them back to the legacy format where items are simple strings.
 *
 * @param data - The EditorJS output data containing blocks to process
 * @returns Modified output data with list blocks converted to legacy format
 *
 * @example
 * // New format (v2.0.0+)
 * { items: [{ content: "Item 1", meta: {} }] }
 * // Converted to legacy format
 * { items: ["Item 1"] }
 *
 * @remarks
 * This conversion is necessary to maintain compatibility with storefronts expecting
 * the old list format and prevents breaking changes during EditorJS upgrades.
 */
export function convertEditorJSListBlocks(data: OutputData): OutputData {
  return {
    ...data,
    blocks: data.blocks.map((block: OutputBlockData) => {
      if (block.type === "list") {
        const listData = block.data as ListBlockDataNew;

        if (
          Array.isArray(listData.items) &&
          listData.items.length > 0 &&
          typeof listData.items[0] === "object" &&
          listData.items[0] !== null
        ) {
          return {
            ...block,
            data: {
              style: listData.style,
              items: listData.items.map(item => item.content),
            } as ListBlockDataOld,
          };
        }
      }

      return block;
    }),
  };
}
