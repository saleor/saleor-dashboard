import { GlobalSearchQuery } from "@dashboard/graphql";

export const prepareResults = (data: GlobalSearchQuery) => {
  const { orders, categories, collections, products, productVariants, models, modelTypes } = data;

  return [
    ...(orders?.edges || []),
    ...(categories?.edges || []),
    ...(collections?.edges || []),
    ...(products?.edges || []),
    ...(productVariants?.edges || []),
    ...(models?.edges || []),
    ...(modelTypes?.edges || []),
  ];
};

export type ItemData = ReturnType<typeof prepareResults>[number];
