import { Option } from "@saleor/macaw-ui-next";

export const toWithCustomValues = (addNewValueLabel: string) => (value: Option) => {
  if (value.label.includes(addNewValueLabel)) {
    return { label: value.value, value: value.value };
  }

  return value;
};
