import { SearchPagesQuery, SearchProductsQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";

import { AttributeInput } from "../Attributes";

type ProductsToFilter = RelayToFlat<SearchProductsQuery["search"]>;
type PagesToFilter = RelayToFlat<SearchPagesQuery["search"]>;

export const filterProducts = (
  products: ProductsToFilter,
  attribute: AttributeInput,
): ProductsToFilter => {
  switch (attribute.data.entityType) {
    case "PRODUCT":
      return (
        products?.filter(product => !attribute.value.includes(product.id)) ?? []
      );
    case "PRODUCT_VARIANT":
      return (
        products?.map(product => ({
          ...product,
          variants:
            product.variants?.filter(
              variant => !attribute.value.includes(variant.id),
            ) ?? [],
        })) ?? []
      );
    default:
      return products;
  }
};

export const filterPages = (
  pages: PagesToFilter,
  attribute: AttributeInput,
): PagesToFilter => {
  return pages?.filter(page => !attribute.value.includes(page.id)) ?? [];
};
