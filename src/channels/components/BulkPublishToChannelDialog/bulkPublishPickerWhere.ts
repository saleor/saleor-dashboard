import { type ProductWhereInput } from "@dashboard/graphql";

const requiresCategoryWhere: ProductWhereInput = { hasCategory: true };

/** Saleor rejects publish without a category — keep those products out of the picker. */
export const withBulkPublishCategoryWhere = (
  where?: ProductWhereInput | null,
): ProductWhereInput => {
  if (!where || Object.keys(where).length === 0) {
    return requiresCategoryWhere;
  }

  return {
    AND: [requiresCategoryWhere, where],
  };
};
