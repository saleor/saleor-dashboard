// @ts-strict-ignore
import { TablePaginationWithContext } from "@dashboard/components/TablePagination";
import { SaleorThrobber } from "@dashboard/components/Throbber";
import { ProductListColumns } from "@dashboard/config";
import { ProductListQuery } from "@dashboard/graphql";
import { ListProps, RelayToFlat } from "@dashboard/types";
import { Box, Text, vars } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import { messages } from "../ProductListDatagrid/messages";
import { ProductTile } from "../ProductTile/ProductTile";

interface ProductListTilesProps extends ListProps<ProductListColumns> {
  products: RelayToFlat<ProductListQuery["products"]> | undefined;
  loading?: boolean;
  onTileClick: (id: string) => void;
}

export const ProductListTiles = ({
  products,
  onTileClick,
  settings,
  disabled,
  loading,
  onUpdateListSettings,
}: ProductListTilesProps) => {
  const intl = useIntl();
  const renderContent = useCallback(() => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" marginY={9}>
          <SaleorThrobber />
        </Box>
      );
    }

    if (products?.length > 0) {
      return (
        <Box
          display="grid"
          gridTemplateColumns={{ mobile: 3, tablet: 5, desktop: 6 }}
          gap={6}
          padding={6}
          __paddingTop={`calc(${vars.spacing[9]} - ${vars.spacing[5]}`}
          data-test-id="tile-view"
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
      <Box padding={6} textAlign="center">
        <Text size={3}>{intl.formatMessage(messages.emptyText)}</Text>
      </Box>
    );
  }, [intl, loading, onTileClick, products]);

  return (
    <>
      {renderContent()}
      <Box paddingX={6}>
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
