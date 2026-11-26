import { parse, print } from "graphql";

const MAX_UNESCAPE_DEPTH = 3;

const tryParseJsonString = (value: string): string | null => {
  try {
    const parsed: unknown = JSON.parse(value);

    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
};

const prettyPrint = (query: string): string | null => {
  try {
    return print(parse(query));
  } catch {
    return null;
  }
};

/**
 * Apps can register a subscription query that was JSON-encoded, either as a whole quoted
 * string or as text with escaped quotes and newlines. Undo that encoding until the text
 * parses as GraphQL, and return it formatted. Returns the input unchanged when no
 * decoding yields valid GraphQL.
 */
export const formatSubscriptionQuery = (rawQuery: string): string => {
  let candidate = rawQuery.trim();

  for (let depth = 0; depth <= MAX_UNESCAPE_DEPTH; depth++) {
    const printed = prettyPrint(candidate);

    if (printed !== null) {
      return printed;
    }

    const decoded = tryParseJsonString(candidate) ?? tryParseJsonString(`"${candidate}"`);

    if (decoded === null || decoded === candidate) {
      break;
    }

    candidate = decoded.trim();
  }

  return rawQuery;
};
