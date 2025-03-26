import { SearchCatalogQuery } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";

type Variant = NonNullable<SearchCatalogQuery["productVariants"]>["edges"][0]["node"];

export const getProductVariantLabel = (variant: Variant) => {
  return (
    <>
      {variant.product.name} / {variant.name}
      {variant.sku && (
        <Text marginLeft={2} size={2}>
          <i>({variant.sku})</i>
        </Text>
      )}
    </>
  );
};
