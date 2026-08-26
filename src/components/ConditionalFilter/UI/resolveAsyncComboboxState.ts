export interface ComboboxOptionIdentity {
  label: string;
  value: string;
  slug?: string | null;
}

const isOptionIdentity = (value: unknown): value is ComboboxOptionIdentity =>
  typeof value === "object" &&
  value !== null &&
  !Array.isArray(value) &&
  "label" in value &&
  "value" in value &&
  typeof (value as ComboboxOptionIdentity).label === "string" &&
  typeof (value as ComboboxOptionIdentity).value === "string";

export const isSameComboboxOption = (
  option: ComboboxOptionIdentity,
  selected: ComboboxOptionIdentity,
): boolean =>
  option.value === selected.value ||
  (!!option.slug && (option.slug === selected.value || option.slug === selected.slug)) ||
  (!!selected.slug && option.value === selected.slug);

export const includeSelectedComboboxOptions = <T extends ComboboxOptionIdentity>(
  options: T[],
  selected?: T | T[] | string | null,
): T[] => {
  if (!selected || typeof selected === "string") {
    return options;
  }

  const selectedItems = Array.isArray(selected) ? selected : [selected];
  const missing = selectedItems.filter(
    item => !options.some(option => isSameComboboxOption(option, item)),
  );

  return missing.length === 0 ? options : [...missing, ...options];
};

export const resolveComboboxValue = <T extends ComboboxOptionIdentity>(
  options: T[],
  selected?: T | string | null,
): T | null => {
  if (!selected || typeof selected === "string") {
    return null;
  }

  return options.find(option => isSameComboboxOption(option, selected)) ?? selected;
};

export const isSelectedComboboxLabel = (selected: unknown, inputValue: string): boolean => {
  if (!inputValue || !isOptionIdentity(selected)) {
    return false;
  }

  return selected.label === inputValue;
};
