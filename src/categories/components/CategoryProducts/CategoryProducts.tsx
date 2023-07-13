// @ts-strict-ignore
import { BulkDeleteButton } from "@dashboard/components/BulkDeleteButton";
import { DashboardCard } from "@dashboard/components/Card";
import { InternalLink } from "@dashboard/components/InternalLink";
import { CategoryDetailsQuery } from "@dashboard/graphql";
import { productAddUrl, productListUrl } from "@dashboard/products/urls";
import { RelayToFlat } from "@dashboard/types";
import { Box, Button } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { CategoryProductListDatagrid } from "../CategoryProductListDatagrid";

interface CategoryProductsProps {
  category: CategoryDetailsQuery["category"];
  categoryId: string;
  products: RelayToFlat<CategoryDetailsQuery["category"]["products"]>;
  disabled: boolean;
  onProductsDelete: () => void;
  onSelectProductsIds: (ids: number[], clearSelection: () => void) => void;
}

export const CategoryProducts = ({
  category,
  categoryId,
  products,
  disabled,
  onProductsDelete,
  onSelectProductsIds,
}: CategoryProductsProps) => (
  <DashboardCard>
    <DashboardCard.Title>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <FormattedMessage
          id="+43JV5"
          defaultMessage="Products in {categoryName}"
          description="header"
          values={{ categoryName: category?.name }}
        />

        <Box display="flex" gap={4}>
          <InternalLink
            to={productListUrl({
              categories: [categoryId],
            })}
          >
            <Button variant="secondary" data-test-id="view-products">
              <FormattedMessage
                id="z8jo8h"
                defaultMessage="View products"
                description="button"
              />
            </Button>
          </InternalLink>

          <InternalLink to={productAddUrl()}>
            <Button variant="secondary" data-test-id="add-products">
              <FormattedMessage
                id="x/pIZ9"
                defaultMessage="Add product"
                description="button"
              />
            </Button>
          </InternalLink>
        </Box>
      </Box>
    </DashboardCard.Title>

    <CategoryProductListDatagrid
      products={products}
      disabled={disabled}
      onSelectProductsIds={onSelectProductsIds}
      selectionActionButton={
        <Box paddingRight={5}>
          <BulkDeleteButton onClick={onProductsDelete}>
            <FormattedMessage defaultMessage="Delete products" id="uwk5e9" />
          </BulkDeleteButton>
        </Box>
      }
    />
  </DashboardCard>
);
