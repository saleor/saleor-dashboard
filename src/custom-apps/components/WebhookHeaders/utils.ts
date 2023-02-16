import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

import { Header } from "./WebhookHeaders";

export const stringifyHeaders = (headers: Header[]): string =>
  JSON.stringify(mapValues(keyBy(headers, "name"), "value"));

const validateName = (name: string): boolean => {
  if (name.length === 0) {
    return false;
  }

  if (name.toLowerCase().startsWith("x-")) {
    return false;
  }

  if (name.toLowerCase() === "authorization") {
    return false;
  }

  return true;
};

export const mapHeaders = (customHeaders: string): Header[] => {
  const parsedHeaders = JSON.parse(customHeaders);

  return Object.keys(parsedHeaders).map(key => ({
    name: key,
    value: parsedHeaders[key],
    error: validateName(key),
  }));
};
