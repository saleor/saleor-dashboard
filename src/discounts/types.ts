import { type DecimalFilterInput, type PromotionTypeEnum } from "@dashboard/graphql";

import { type Rule } from "./models";

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

export type CatalogConditions = "product" | "category" | "collection" | "variant";

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
