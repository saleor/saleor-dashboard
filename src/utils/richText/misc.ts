import { OutputData } from "@editorjs/editorjs";

export const getParsedDataForJsonStringField = (
  data: OutputData,
): string | null => (data?.blocks?.length ? JSON.stringify(data) : null);
