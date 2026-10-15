import { type OutputData } from "@editorjs/editorjs";

export const getParsedDataForJsonStringField = (
  data: OutputData | null | undefined,
): string | null => (data?.blocks?.length ? JSON.stringify(data) : null);
