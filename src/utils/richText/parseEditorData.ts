import { type OutputData } from "@editorjs/editorjs";

export const EMPTY_EDITOR_DATA: OutputData = { blocks: [] };

export function parseEditorData(value: string | null | undefined): OutputData {
  if (!value) {
    return EMPTY_EDITOR_DATA;
  }

  try {
    return JSON.parse(value) as OutputData;
  } catch {
    return EMPTY_EDITOR_DATA;
  }
}
