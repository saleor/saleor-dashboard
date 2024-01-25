import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { Option } from "@saleor/macaw-ui-next";
import { useEffect, useState } from "react";
import { IntlShape, useIntl } from "react-intl";

export const useConditionNameOptions = (discountType: PromotionTypeEnum) => {
  const intl = useIntl();
  const [conditionNameOptions, setConditionNameOptions] = useState<Option[]>(
    [],
  );

  useEffect(() => {
    if (discountType === PromotionTypeEnum.CATALOGUE) {
      setConditionNameOptions(getCatalogConditionOptions(intl));
    } else {
      setConditionNameOptions(getOrderConditionOptions(intl));
    }
  }, [discountType]);

  const getConditionNameOptionByValue = (value: string) => {
    return conditionNameOptions.find(option => option.value === value);
  };

  return {
    conditionNameOptions,
    getConditionNameOptionByValue,
  };
};

function getOrderConditionOptions(intl: IntlShape): Array<{
  label: string;
  value: OrderConditions;
}> {
  return [
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
  ];
}

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