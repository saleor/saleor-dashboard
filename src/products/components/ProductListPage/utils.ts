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
    const price = productVariants[i].price;
    max = price.amount > max ? price.amount : max;
    min = price.amount < min ? price.amount : min;
  }

  return {
    max,
    min
  };
}
