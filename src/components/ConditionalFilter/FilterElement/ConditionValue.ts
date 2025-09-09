export interface ItemOption {
  label: string;
  value: string;
  slug: string;
  // TODO: remove this when https://github.com/saleor/saleor/issues/13076 is ready
  originalSlug?: string | null;
}

export type ConditionValue = ItemOption | ItemOption[] | string | string[] | [string, string];

export const isItemOption = (x: unknown): x is ItemOption =>
  typeof x === "object" && x !== null && "value" in x;

export const isItemOptionArray = (x: unknown): x is ItemOption[] =>
  Array.isArray(x) && (x as ItemOption[]).every(isItemOption);

export const isTuple = (x: unknown): x is [string, string] =>
  Array.isArray(x) && x.length === 2 && (x as string[]).every(y => typeof y === "string");

export const slugFromConditionValue = (rawEntry?: ConditionValue): string | string[] => {
  if (typeof rawEntry === "string") {
    return rawEntry;
  }

  if (Array.isArray(rawEntry)) {
    return rawEntry.map(el => (typeof el === "string" ? el : el.slug));
  }

  return rawEntry?.slug ?? "";
};
