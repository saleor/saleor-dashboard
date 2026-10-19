type InternalDescriptionChange = "added" | "changed" | "removed";

export const normalizeInternalDescription = (value: string | null | undefined): string | null =>
  value?.trim() ? value : null;

export const getInternalDescriptionChange = (
  previous: string | null | undefined,
  next: string | null | undefined,
): InternalDescriptionChange | null => {
  const before = normalizeInternalDescription(previous);
  const after = normalizeInternalDescription(next);

  if (before === after) {
    return null;
  }

  if (before === null) {
    return "added";
  }

  return after === null ? "removed" : "changed";
};
