import { GlobalSearchQuery } from "@dashboard/graphql";

export const prepareResults = (data: GlobalSearchQuery) => {
  const { __typename, ...resources } = data;
  const empty = Object.values(resources).every(value => value?.edges?.length === 0);

  return {
    orders: resources.orders?.edges.map(r => r.node) || [],
    categories: resources.categories?.edges.map(r => r.node) || [],
    collections: resources.collections?.edges.map(r => r.node) || [],
    products: resources.products?.edges.map(r => r.node) || [],
    productVariants: resources.productVariants?.edges.map(r => r.node) || [],
    models: resources.models?.edges.map(r => r.node) || [],
    modelTypes: resources.modelTypes?.edges.map(r => r.node) || [],
    empty,
  };
};

export type ItemData = ReturnType<typeof prepareResults>;
