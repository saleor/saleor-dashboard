import { CatalogConditions } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { IntlShape, useIntl } from "react-intl";

export const useConditionNames = () => {
  const intl = useIntl();
  const [conditionNames] = useState<Option[]>(getCatalogConditionOptions(intl));

  return {
    conditionNames,
  };
};

function getCatalogConditionOptions(intl: IntlShape): Array<{
  label: string;
  value: CatalogConditions;
}> {
  return [
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
      label: intl.formatMessage({ defaultMessage: "Categories", id: "VKb1MS" }),
      value: "category",
    },
    {
      label: intl.formatMessage({ defaultMessage: "Variants", id: "h5P++h" }),
      value: "variant",
    },
  ];
}
