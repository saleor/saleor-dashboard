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
): Record<CatalogConditions | OrderConditions, ConditionType[]> => {
  const CONDITIONT_TYPES_LABELS = {
    IS: intl.formatMessage({ defaultMessage: "is", id: "fXdkiI" }),
    LOWER: intl.formatMessage({ defaultMessage: "lower", id: "L5IuDw" }),
    GREATER: intl.formatMessage({ defaultMessage: "greater", id: "PFnobO" }),
    BETWEEN: intl.formatMessage({ defaultMessage: "between", id: "BvGp1I" }),
  };

  return {
    product: [
      {
        type: "multiselect",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
    ],
    category: [
      {
        type: "multiselect",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
    ],
    collection: [
      {
        type: "multiselect",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
    ],
    variant: [
      {
        type: "multiselect",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
    ],
    baseSubtotalPrice: [
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.LOWER,
        value: "lower",
      },
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.GREATER,
        value: "greater",
      },
      {
        type: "price.range",
        label: CONDITIONT_TYPES_LABELS.BETWEEN,
        value: "between",
      },
    ],
    baseTotalPrice: [
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.IS,
        value: "is",
      },
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.LOWER,
        value: "lower",
      },
      {
        type: "price",
        label: CONDITIONT_TYPES_LABELS.GREATER,
        value: "greater",
      },
      {
        type: "price.range",
        label: CONDITIONT_TYPES_LABELS.BETWEEN,
        value: "between",
      },
    ],
  };
};

export const useCondtionTypes = () => {
  const intl = useIntl();
  const conditionsTypes = useMemo<Record<CatalogConditions | OrderConditions, ConditionType[]>>(
    () => getConditionsTypes(intl),
    [intl],
  );
  const getConditionTypesOptions = (type: string): Option[] => {
    const conditionTypes: ConditionType[] | undefined =
      conditionsTypes[type as CatalogConditions | OrderConditions];

    if (conditionTypes) {
      return conditionTypes.map(({ label, value }) => ({
        label,
        value,
      }));
    }

    return [];
  };
  const getConditionTypeByLabel = (conditionName: string, type: string) => {
    const conditionTypes: ConditionType[] | undefined =
      conditionsTypes[conditionName as CatalogConditions | OrderConditions];

    if (conditionTypes) {
      const conditionType = conditionTypes.find(({ value }) => value === type);

      if (conditionType) {
        return conditionType.type;
      }
    }

    return null;
  };

  return {
    getConditionTypesOptions,
    getConditionTypeByLabel,
  };
};
