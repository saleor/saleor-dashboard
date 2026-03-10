export const isString = (value: unknown): value is string =>
  typeof value === "string";

export const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) &&
  value.every((item) => isString(item)) &&
  value.length > 0;
