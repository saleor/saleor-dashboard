import { ProductList_products_edges_node_variants } from "@saleor/products/types/ProductList";

const prefix = "attribute";

export function getAttributeColumnValue(id: string) {
  return `${prefix}:${id}`;
}

export function isAttributeColumnValue(value: string) {
  return value.includes(`${prefix}:`);
}

export function getAttributeIdFromColumnValue(value: string) {
  return value.substr(prefix.length + 1);
}

export function getProductPriceRange(
  productVariants: ProductList_products_edges_node_variants[]
) {
  let max = productVariants[0].price.amount;
  let min = productVariants[0].price.amount;

  for (let i = 1, len = productVariants.length; i < len; i++) {
    const curr = productVariants[i].price.amount;
    max = curr > max ? curr : max;
    min = curr < min ? curr : min;
  }

  return {
    max,
    min
  };
}
