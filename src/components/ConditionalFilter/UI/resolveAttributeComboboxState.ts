import { includeSelectedComboboxOptions, resolveComboboxValue } from "./resolveAsyncComboboxState";
import { type LeftOperatorOption } from "./types";

type SelectedAttributeOption = Pick<LeftOperatorOption, "label" | "value" | "type">;

const toAttributeOption = (selected: SelectedAttributeOption): LeftOperatorOption => ({
  label: selected.label,
  value: selected.value,
  type: selected.type,
  slug: selected.value,
});

export const resolveAttributeComboboxOptions = (
  options: LeftOperatorOption[],
  selected?: SelectedAttributeOption | null,
): LeftOperatorOption[] => {
  if (!selected) {
    return options;
  }

  return includeSelectedComboboxOptions(options, toAttributeOption(selected));
};

export const resolveAttributeComboboxValue = (
  options: LeftOperatorOption[],
  selected?: SelectedAttributeOption | null,
): LeftOperatorOption | null => {
  if (!selected) {
    return null;
  }

  return resolveComboboxValue(options, toAttributeOption(selected));
};
