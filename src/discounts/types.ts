import useCategorySearch from "@dashboard/searches/useCategorySearch";
import useCollectionSearch from "@dashboard/searches/useCollectionSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";

import { Rule } from "./models";

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

export type ConditionType = "product" | "category" | "collection" | "variant";

// Mimic API catalogue predicate structure because api scheme type return any
export interface CataloguePredicateAPI {
  OR?: CataloguePredicateAPI[];
  AND?: CataloguePredicateAPI[];
  productPredicate?: {
    ids: string[];
  };
  categoryPredicate?: {
    ids: string[];
  };
  collectionPredicate?: {
    ids: string[];
  };
  variantPredicate?: {
    ids: string[];
  };
}
