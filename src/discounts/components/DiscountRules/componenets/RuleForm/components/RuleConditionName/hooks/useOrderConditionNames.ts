import { Option } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export const useOrderConditionNames = (): Option[] => {
  const intl = useIntl();

  const options = useMemo(
    () => [
      {
        label: intl.formatMessage({
          id: "6pPMp9",
          defaultMessage: "Subtotal price",
        }),
        value: "baseSubtotalPrice",
      },
      {
        label: intl.formatMessage({
          id: "4VivsY",
          defaultMessage: "Total price",
        }),
        value: "baseTotalPrice",
      },
    ],
    [intl],
  );

  return options;
};
