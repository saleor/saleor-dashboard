import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductListColumns } from "@dashboard/config";
import { ProductListQuery } from "@dashboard/graphql";
import { ListProps, RelayToFlat } from "@dashboard/types";
import { CircularProgress } from "@material-ui/core";
import { Box, sprinkles } from "@saleor/macaw-ui/next";
import React from "react";
import { useIntl } from "react-intl";

import { ProductTile } from "../ProductTile/ProductTile";

export interface ProductListTilesProps extends ListProps<ProductListColumns> {
  products: RelayToFlat<ProductListQuery["products"]>;
  onTileClick: (id: string) => void;
}

export const ProductListTiles: React.FC<ProductListTilesProps> = props => {
  const { products, onTileClick, settings, disabled, onUpdateListSettings } =
    props;

  const intl = useIntl();
  return (
    <>
      {products ? (
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
      )}
      <div className={sprinkles({ paddingX: 9 })}>
        <TablePaginationWithContext
          component="div"
          settings={settings}
          disabled={disabled}
          labels={{
            noOfRows: intl.formatMessage({
              id: "9B2mOB",
              defaultMessage: "No. of products",
              description: "tile view pagination label",
            }),
          }}
          onUpdateListSettings={onUpdateListSettings}
        />
      </div>
    </>
  );
};
