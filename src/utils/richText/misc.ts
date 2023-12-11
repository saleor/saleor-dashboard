import { OutputData } from "@editorjs/editorjs";

export const getParsedDataForJsonStringField = (
  data?: OutputData | null,
): string | null => (data?.blocks?.length ? JSON.stringify(data) : null);
