import { type PromotionWhereInput } from "@dashboard/graphql";

/**
 * The list's `where` input: the filters, and the search when there is one. The filters arrive
 * wrapped in an `AND` list, and Saleor rejects a where input that mixes `AND` with a field filter
 * such as `name` ("Cannot mix operators with other filter inputs"), so both go into one `AND`.
 */
export const getPromotionListWhere = (
  filters: PromotionWhereInput | null | undefined,
  query: string | undefined,
): PromotionWhereInput => {
  const hasFilters = !!filters && Object.keys(filters).length > 0;

  if (!query) {
    return hasFilters ? filters : {};
  }

  const search: PromotionWhereInput = { name: { eq: query } };

  return hasFilters ? { AND: [filters, search] } : search;
};
