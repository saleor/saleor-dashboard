import { countUniqueAttributeIds } from "@dashboard/attributes/utils/countUniqueAttributeIds";
import {
  type PageTypeListWithAssignedAttributeCountsQuery,
  type ProductTypeListWithAssignedAttributeCountsQuery,
} from "@dashboard/graphql";
import { type ModelTypeTabCount } from "@dashboard/modeling/components/ModelTypeTabs/ModelTypeTabs";

const toTabCount = (value: number): ModelTypeTabCount => ({
  value,
  hasMore: false,
});

export const computePageTypeTabCounts = (
  data: PageTypeListWithAssignedAttributeCountsQuery | undefined,
): Record<string, ModelTypeTabCount> => {
  const counts: Record<string, ModelTypeTabCount> = {};

  data?.pageTypes?.edges?.forEach(({ node }) => {
    counts[node.id] = toTabCount(node.attributes?.length ?? 0);
  });

  return counts;
};

export const computeProductTypeTabCounts = (
  data: ProductTypeListWithAssignedAttributeCountsQuery | undefined,
): Record<string, ModelTypeTabCount> => {
  const counts: Record<string, ModelTypeTabCount> = {};

  data?.productTypes?.edges?.forEach(({ node }) => {
    counts[node.id] = toTabCount(
      countUniqueAttributeIds([node.productAttributes, node.variantAttributes]),
    );
  });

  return counts;
};
