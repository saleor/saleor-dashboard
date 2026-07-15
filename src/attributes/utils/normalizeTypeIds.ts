export const normalizeTypeIds = (value: string | string[] | undefined): string[] => {
  if (!value) {
    return [];
  }

  const ids = Array.isArray(value) ? value.filter(Boolean) : [value];

  return [...new Set(ids)];
};
