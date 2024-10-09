const prefix = "attribute";

export function isAttributeColumnValue(value: string) {
  return value?.includes(`${prefix}:`);
}

export function getAttributeIdFromColumnValue(value: string) {
  return value.substr(prefix.length + 1);
}
