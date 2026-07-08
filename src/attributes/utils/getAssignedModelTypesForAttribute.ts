import { type PageTypeListWithAssignedAttributeCountsQuery } from "@dashboard/graphql";

import { type AssignedTypeItem } from "./mapAssignedTypeConnection";

export interface AssignedModelTypesResult {
  items: AssignedTypeItem[];
  typesListHasMore: boolean;
}

export const getAssignedModelTypesForAttribute = (
  data: PageTypeListWithAssignedAttributeCountsQuery | undefined,
  attributeId: string,
): AssignedModelTypesResult => {
  const items: AssignedTypeItem[] = [];

  data?.pageTypes?.edges?.forEach(({ node }) => {
    if (node.attributes?.some(attribute => attribute.id === attributeId)) {
      items.push({ id: node.id, name: node.name });
    }
  });

  return {
    items,
    typesListHasMore: !!data?.pageTypes?.pageInfo?.hasNextPage,
  };
};
