import { ProductListQuery } from "@dashboard/graphql";
import { FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { CircularProgress } from "@material-ui/core";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { ProductTile } from "../ProductTile/ProductTile";

export interface ProductListTilesProps extends FetchMoreProps {
  products: RelayToFlat<ProductListQuery["products"]>;
  onTileClick: (id: string) => void;
}

export const ProductListTiles: React.FC<ProductListTilesProps> = props => {
  const { products, onTileClick } = props;

  return products ? (
    <Box
      display="grid"
      gridTemplateColumns={{ mobile: 3, tablet: 5, desktop: 6 }}
      gap={9}
      padding={9}
    >
      {products.map(product => (
        <ProductTile
          key={product.id}
          product={product}
          onClick={() => onTileClick(product.id)}
        />
      ))}
    </Box>
  ) : (
    <Box display="flex" justifyContent="center" height="100%" marginY={12}>
      <CircularProgress />
    </Box>
  );
};
