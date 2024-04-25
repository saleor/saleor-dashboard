import { Option } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "../messages";

export const useCombbobxCustomOption = ({
  query,
  selectedValue,
  allowCustomValues,
}: {
  selectedValue: Option | Option[] | null;
  query: string;
  allowCustomValues?: boolean;
}) => {
  const intl = useIntl();
  const customValueLabel = intl.formatMessage(messages.addNewValue, {
    value: query,
  });
  const customValueOption = showCustomValue({
    query,
    selectedValue,
    allowCustomValues,
  })
    ? [
        {
          label: customValueLabel,
          value: query,
        },
      ]
    : [];

  return {
    customValueLabel,
    customValueOption,
  };
};

function showCustomValue({
  query,
  selectedValue,
  allowCustomValues,
}: {
  selectedValue: Option | Option[] | null;
  query: string;
  allowCustomValues?: boolean;
}) {
  if (!query || !allowCustomValues) {
    return false;
  }

  if (Array.isArray(selectedValue)) {
    return !selectedValue.find(option => option.label.toLowerCase() === query.toLowerCase());
  }

  return selectedValue?.label.toLocaleLowerCase() !== query.toLocaleLowerCase();
}
