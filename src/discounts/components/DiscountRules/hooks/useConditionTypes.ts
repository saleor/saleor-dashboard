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
  baseSubtotalPrice: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  baseTotalPrice: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
};

export const useCondtionTypes = () => {
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
      const conditionType = conditionTypes.find(
        ({ label }) => {
          if (typeof type === "string") {
            return label === type;
          }

          return label === (type as any).value;
        }, // TODO: type shoudl be string not option
      );

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
