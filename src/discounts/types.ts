import { RewardValueTypeEnum } from "@dashboard/graphql";
import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { Option } from "@saleor/macaw-ui-next";

export enum RequirementsPicker {
  ORDER = "ORDER",
  ITEM = "ITEM",
  NONE = "NONE",
}

export enum DiscountTypeEnum {
  VALUE_FIXED = "VALUE_FIXED",
  VALUE_PERCENTAGE = "VALUE_PERCENTAGE",
  SHIPPING = "SHIPPING",
}

export type SearchCategoriesOpts = ReturnType<
  typeof useCategorySearch
>["result"];
export type SearchCollectionOpts = ReturnType<
  typeof useCollectionSearch
>["result"];
export type SearchProductsOpts = ReturnType<typeof useProductSearch>["result"];

export interface DiscoutFormData {
  name: string;
  description: string;
  dates: {
    endDate: string;
    endTime: string;
    hasEndDate: boolean;
    startDate: string;
    startTime: string;
  };
  rules: Rule[];
}

export interface Rule {
  name: string;
  description: string;
  channels: Option[];
  conditions: Condition[];
  rewardValueType: RewardValueTypeEnum;
  rewardValue: number;
}

export interface Condition {
  type: "product" | "category" | "collection" | "variant";
  condition: "is";
  values: Option[];
}
