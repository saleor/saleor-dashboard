// @ts-strict-ignore
import { Placeholder } from "@dashboard/components/Placeholder/Placeholder";
import { SaleorThrobber } from "@dashboard/components/Throbber/SaleorThrobber";
import { type ProductListColumns } from "@dashboard/config";
import { type ProductListQuery } from "@dashboard/graphql";
import { type ListProps, type RelayToFlat } from "@dashboard/types";
import { Box, vars } from "@saleor/macaw-ui-next";
import { useCallback } from "react";
import { useIntl } from "react-intl";

import { messages } from "../ProductListDatagrid/messages";
import { ProductListPagination } from "../ProductListPagination/ProductListPagination";
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
          paddingX={6}
          __paddingTop={`calc(${vars.spacing[9]} - ${vars.spacing[5]})`}
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
      <Box paddingX={6} paddingBottom={6}>
        <Placeholder>
          <span data-test-id="empty-data-grid-text">{intl.formatMessage(messages.emptyText)}</span>
        </Placeholder>
      </Box>
    );
  }, [intl, loading, onTileClick, products]);

  return (
    <>
      {renderContent()}
      <ProductListPagination
        settings={settings}
        disabled={disabled}
        onUpdateListSettings={onUpdateListSettings}
      />
    </>
  );
};
