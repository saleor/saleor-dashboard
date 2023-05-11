import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { ProductListColumns } from "@dashboard/config";
import { ProductListQuery } from "@dashboard/graphql";
import { ListProps, RelayToFlat } from "@dashboard/types";
import { CircularProgress } from "@material-ui/core";
import { Box, Text, vars } from "@saleor/macaw-ui/next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { messages } from "../ProductListDatagrid/messages";
import { ProductTile } from "../ProductTile/ProductTile";

export interface ProductListTilesProps extends ListProps<ProductListColumns> {
  products: RelayToFlat<ProductListQuery["products"]> | undefined;
  loading?: boolean;
  onTileClick: (id: string) => void;
}

export const ProductListTiles: React.FC<ProductListTilesProps> = ({
  products,
  onTileClick,
  settings,
  disabled,
  loading,
  onUpdateListSettings,
}) => {
  const intl = useIntl();

  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" marginY={12}>
          <CircularProgress />
        </Box>
      );
    }

    if (products?.length > 0) {
      return (
        <Box
          display="grid"
          gridTemplateColumns={{ mobile: 3, tablet: 5, desktop: 6 }}
          gap={9}
          padding={9}
          __paddingTop={`calc(${vars.space[9]} - ${vars.space[5]}`}
        >
          {products.map(product => (
            <ProductTile
              key={product.id}
              product={product}
              onClick={() => onTileClick(product.id)}
            />
          ))}
        </Box>
      );
    }

    return (
      <Box padding={9} textAlign="center">
        <Text size="small">{intl.formatMessage(messages.emptyText)}</Text>
      </Box>
    );
  }, [intl, loading, onTileClick, products]);

  return (
    <>
      {renderContent()}
      <Box paddingX={9}>
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
      </Box>
    </>
  );
};
