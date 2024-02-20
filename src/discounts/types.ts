import { DecimalFilterInput, PromotionTypeEnum } from "@dashboard/graphql";
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
  type: PromotionTypeEnum;
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

export type CatalogConditions =
  | "product"
  | "category"
  | "collection"
  | "variant";

export type OrderConditions = "baseSubtotalPrice" | "baseTotalPrice";

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

export interface OrderPredicateAPI {
  OR?: OrderPredicateAPI[];
  AND?: OrderPredicateAPI[];
  discountedObjectPredicate: {
    baseSubtotalPrice?: DecimalFilterInput;
    baseTotalPrice?: DecimalFilterInput;
    AND?: Array<OrderPredicateAPI["discountedObjectPredicate"]>;
    OR?: Array<OrderPredicateAPI["discountedObjectPredicate"]>;
  };
}
