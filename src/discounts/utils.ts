import {
  type PromotionRuleDetailsFragment,
  type SaleDetailsQuery,
  type VoucherDetailsQuery,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { sortAlphabetically } from "@dashboard/utils/sort";

import { type Rule } from "./models";
import {
  type SearchCategoriesOpts,
  type SearchCollectionOpts,
  type SearchProductsOpts,
} from "./types";

type SaleOrVoucherData = SaleDetailsQuery | VoucherDetailsQuery;
export type PromotionStatus = "scheduled" | "active" | "finished";

const getCriteria = (data: SaleOrVoucherData) => {
  if (!!data && "sale" in data) {
    return data.sale;
  }

  if (!!data && "voucher" in data) {
    return data.voucher;
  }
};

export function getFilteredCategories(
  data: SaleOrVoucherData,
  searchCategoriesOpts: SearchCategoriesOpts,
) {
  const categories = mapEdgesToItems(searchCategoriesOpts?.data?.search);
  const criteria = getCriteria(data);

  if (!criteria?.categories?.edges) {
    return categories;
  }

  const excludedCategoryIds = criteria.categories.edges.map(category => category.node.id);

  return categories?.filter(
    suggestedCategory => !excludedCategoryIds.includes(suggestedCategory.id),
  );
}

export function getFilteredCollections(
  data: SaleOrVoucherData,
  searchCollectionsOpts: SearchCollectionOpts,
) {
  const collections = mapEdgesToItems(searchCollectionsOpts?.data?.search);
  const criteria = getCriteria(data);

  if (!criteria?.collections?.edges) {
    return collections;
  }

  const excludedCollectionIds = criteria?.collections.edges.map(collection => collection.node.id);

  return collections?.filter(
    suggestedCollection => !excludedCollectionIds.includes(suggestedCollection.id),
  );
}

export function getFilteredProducts(
  data: SaleOrVoucherData,
  searchProductsOpts: SearchProductsOpts,
) {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);
  const criteria = getCriteria(data);

  if (!criteria?.products?.edges) {
    return products;
  }

  const excludedProductIds = criteria?.products.edges.map(product => product.node.id);

  return products?.filter(suggestedProduct => !excludedProductIds.includes(suggestedProduct.id));
}

export function getFilteredProductVariants(
  variants: NonNullable<SaleDetailsQuery["sale"]>["variants"] | null,
  searchProductsOpts: SearchProductsOpts,
) {
  const products = mapEdgesToItems(searchProductsOpts?.data?.search);

  if (!variants?.edges) {
    return products;
  }

  const excludedVariantsIds = variants?.edges.map(variant => variant.node.id);

  return products?.map(suggestedProduct => ({
    ...suggestedProduct,
    variants: suggestedProduct.variants?.filter(
      variant => !excludedVariantsIds.includes(variant.id),
    ),
  }));
}

export function sortRules(rules: Rule[]) {
  return rules.sort(sortAlphabetically("name"));
}

export function sortAPIRules(rules: PromotionRuleDetailsFragment[]) {
  return rules.sort(sortAlphabetically("name"));
}

/** ISO / API date strings or pre-parsed {@link Date}; invalid values yield NaN (never throws). */
function toUtcMillis(value: string | Date | null | undefined): number {
  if (value == null || value === "") {
    return NaN;
  }

  try {
    const instant = value instanceof Date ? value : new Date(value);
    const ms = instant.getTime();

    return Number.isFinite(ms) ? ms : NaN;
  } catch {
    return NaN;
  }
}

export function getPromotionStatus(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  now = new Date(),
): PromotionStatus {
  const nowTimestamp = now.getTime();
  const startTimestamp = toUtcMillis(startDate);
  const endTimestamp = toUtcMillis(endDate);

  if (Number.isFinite(startTimestamp) && startTimestamp > nowTimestamp) {
    return "scheduled";
  }

  if (Number.isFinite(endTimestamp) && endTimestamp < nowTimestamp) {
    return "finished";
  }

  return "active";
}

/**
 * Relative time value/unit for scheduled (vs start) or finished (vs end) promotions.
 * Active promotions have no reference date for this hint.
 */
export function getRelativePromotionTimeParts(
  status: PromotionStatus,
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined,
  now = new Date(),
): { unit: Intl.RelativeTimeFormatUnit; value: number } | null {
  const referenceDate = status === "scheduled" ? startDate : status === "finished" ? endDate : null;

  if (referenceDate == null || referenceDate === "") {
    return null;
  }

  const referenceMs = toUtcMillis(referenceDate);

  if (!Number.isFinite(referenceMs)) {
    return null;
  }

  const diffMs = referenceMs - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const MINUTE = 60_000;
  const HOUR = 3_600_000;
  const DAY = 86_400_000;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;

  if (absDiffMs < HOUR) {
    value = Math.round(diffMs / MINUTE);
    unit = "minute";
  } else if (absDiffMs < DAY) {
    value = Math.round(diffMs / HOUR);
    unit = "hour";
  } else {
    value = Math.round(diffMs / DAY);
    unit = "day";
  }

  if (!Number.isFinite(value)) {
    return null;
  }

  return { unit, value };
}
