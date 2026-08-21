import { type Option } from "@saleor/macaw-ui-next";

export const isAddNewValueOption = (
  option: Pick<Option, "label">,
  addNewValueLabel: string,
): boolean => option.label === addNewValueLabel;

export const toWithCustomValues = (addNewValueLabel: string) => (value: Option) => {
  if (isAddNewValueOption(value, addNewValueLabel)) {
    return { label: value.value, value: value.value };
  }

  return value;
};
