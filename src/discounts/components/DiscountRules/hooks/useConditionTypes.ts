import { CatalogConditions, OrderConditions } from "@dashboard/discounts/types";
import { Option } from "@saleor/macaw-ui-next";

export interface ConditionType {
  type: string;
  label: string;
  value: string;
}

export const conditionsTypes: Record<
  CatalogConditions | OrderConditions,
  ConditionType[]
> = {
  product: [
    {
      type: "multiselect",
      label: "is",
      value: "input-1",
    },
  ],
  category: [
    {
      type: "multiselect",
      label: "is",
      value: "input-1",
    },
  ],
  collection: [
    {
      type: "multiselect",
      label: "is",
      value: "input-1",
    },
  ],
  variant: [
    {
      type: "multiselect",
      label: "is",
      value: "input-1",
    },
  ],
  subtotal: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  total: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
};

export const useCondtionTypes = () => {
  const getConditionTypesOptions = (
    type: CatalogConditions | OrderConditions,
  ): Option[] => {
    const conditionTypes = conditionsTypes[type];

    if (conditionTypes) {
      return conditionTypes.map(condition => ({
        label: condition.label,
        value: condition.value,
      }));
    }

    return [];
  };

  return {
    getConditionTypesOptions,
  };
};
