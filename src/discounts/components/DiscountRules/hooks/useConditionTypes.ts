import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";
import { useMemo } from "react";
import { IntlShape, useIntl } from "react-intl";

export interface ConditionType {
  type: string;
  label: string;
  value: string;
}

// Current support condition type field: multiselect, price, price.range, number, number.range
export const getConditionsTypes = (
  intl: IntlShape,
): Record<CatalogConditions | OrderConditions, ConditionType[]> => ({
  product: [
    {
      type: "multiselect",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
  ],
  category: [
    {
      type: "multiselect",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
  ],
  collection: [
    {
      type: "multiselect",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
  ],
  variant: [
    {
      type: "multiselect",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
  ],
  baseSubtotalPrice: [
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "lower", id: "L5IuDw" }),
      value: "input-2",
    },
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "greater", id: "PFnobO" }),
      value: "input-3",
    },
    {
      type: "price.range",
      label: intl.formatMessage({ defaultMessage: "between", id: "BvGp1I" }),
      value: "input-4",
    },
  ],
  baseTotalPrice: [
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
      value: "input-1",
    },
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "lower", id: "L5IuDw" }),
      value: "input-2",
    },
    {
      type: "price",
      label: intl.formatMessage({ defaultMessage: "lower", id: "L5IuDw" }),
      value: "input-3",
    },
    {
      type: "price.range",
      label: intl.formatMessage({ defaultMessage: "lower", id: "L5IuDw" }),
      value: "input-4",
    },
  ],
});

export const useCondtionTypes = () => {
  const intl = useIntl();
  const conditionsTypes = useMemo(() => getConditionsTypes(intl), [intl]);

  const getConditionTypesOptions = (type: string): Option[] => {
    const conditionTypes = conditionsTypes[type];

    if (conditionTypes) {
      return conditionTypes.map(({ label }) => ({
        label,
        value: label,
      }));
    }

    return [];
  };

  const getConditionInputTypeByLabel = (
    conditionName: string,
    type: string,
  ) => {
    const conditionTypes = conditionsTypes[conditionName];

    if (conditionTypes) {
      const conditionType = conditionTypes.find(({ label }) => label === type);

      if (conditionType) {
        return conditionType.type;
      }
    }

    return null;
  };

  return {
    getConditionTypesOptions,
    getConditionInputTypeByLabel,
  };
};
