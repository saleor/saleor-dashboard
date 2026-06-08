export interface ParsedOembedData {
  html?: string;
  thumbnail_url?: string;
}

export function parseOembedData(oembedData: string | null | undefined): ParsedOembedData {
  if (!oembedData) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(oembedData);

    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    const result: ParsedOembedData = {};

    if ("html" in parsed && typeof parsed.html === "string") {
      result.html = parsed.html;
    }

    if ("thumbnail_url" in parsed && typeof parsed.thumbnail_url === "string") {
      result.thumbnail_url = parsed.thumbnail_url;
    }

    return result;
  } catch {
    return {};
  }
}
