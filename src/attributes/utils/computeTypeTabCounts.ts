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
    const ids = new Set<string>();

    node.productAttributes?.forEach(attribute => ids.add(attribute.id));
    node.variantAttributes?.forEach(attribute => ids.add(attribute.id));

    counts[node.id] = toTabCount(ids.size);
  });

  return counts;
};
