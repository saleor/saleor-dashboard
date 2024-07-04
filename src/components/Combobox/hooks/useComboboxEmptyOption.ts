import { Option } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

export const useComboboxEmptyOption = () => {
  const intl = useIntl();

  const emptyOption: Option = {
    label: intl.formatMessage({
      id: "pGfO2i",
      defaultMessage: "None",
      description: "empty option",
    }),
    value: "",
  };

  return {
    emptyOption,
  };
};
