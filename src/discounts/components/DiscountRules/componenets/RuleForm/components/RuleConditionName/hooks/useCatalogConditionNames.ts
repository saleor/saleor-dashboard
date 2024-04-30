import { Option } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export const useCatalogConditionNames = (): Option[] => {
  const intl = useIntl();
  const options = useMemo(
    () => [
      {
        label: intl.formatMessage({ defaultMessage: "Products", id: "7NFfmz" }),
        value: "product",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Collections",
          id: "ulh3kf",
        }),
        value: "collection",
      },
      {
        label: intl.formatMessage({
          defaultMessage: "Categories",
          id: "VKb1MS",
        }),
        value: "category",
      },
      {
        label: intl.formatMessage({ defaultMessage: "Variants", id: "h5P++h" }),
        value: "variant",
      },
    ],
    [intl],
  );

  return options;
};
