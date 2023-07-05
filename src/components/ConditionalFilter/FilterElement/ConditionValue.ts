export interface ItemOption {
  label: string;
  value: string;
  slug: string;
}

export type ConditionValue =
  | ItemOption
  | ItemOption[]
  | string
  | string[]
  | [string, string];

export const slugFromConditionValue = (
  rawEntry: ConditionValue,
): string | string[] => {
  if (typeof rawEntry === "string") {
    return rawEntry;
  }

  if (Array.isArray(rawEntry)) {
    return rawEntry.map(el => (typeof el === "string" ? el : el.slug));
  }

  return rawEntry.slug;
};
