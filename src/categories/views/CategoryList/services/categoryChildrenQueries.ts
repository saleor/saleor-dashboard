import { type ApolloClient } from "@apollo/client";
import {
  CategoryChildrenDocument,
  type CategoryChildrenQuery,
  type CategoryChildrenQueryVariables,
  type CategoryFragment,
} from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

const getCategoryChildrenVariables = (
  parentId: string,
  pageSize: number,
): CategoryChildrenQueryVariables => ({
  id: parentId,
  first: pageSize,
  after: null,
});

export const readCategoryChildrenFromCache = (
  client: ApolloClient<object>,
  parentId: string,
  pageSize: number,
): CategoryFragment[] => {
  try {
    const cached = client.readQuery<CategoryChildrenQuery, CategoryChildrenQueryVariables>({
      query: CategoryChildrenDocument,
      variables: getCategoryChildrenVariables(parentId, pageSize),
    });

    return mapEdgesToItems(cached?.category?.children) ?? [];
  } catch {
    return [];
  }
};

export const fetchCategoryChildrenNetworkOnly = async (
  client: ApolloClient<object>,
  parentId: string,
  pageSize: number,
): Promise<CategoryChildrenQuery | undefined> => {
  const response = await client.query<CategoryChildrenQuery, CategoryChildrenQueryVariables>({
    query: CategoryChildrenDocument,
    variables: getCategoryChildrenVariables(parentId, pageSize),
    fetchPolicy: "network-only",
  });

  return response.data;
};

export const refetchParentChildren = async (
  client: ApolloClient<object>,
  parentIds: string[],
  pageSize: number,
): Promise<void> => {
  await Promise.allSettled(
    parentIds.map(parentId => fetchCategoryChildrenNetworkOnly(client, parentId, pageSize)),
  );
};
