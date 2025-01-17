import { DashboardCard } from "@dashboard/components/Card";
import { CollectionDetailsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ListActions, PageListProps } from "../../../types";
import { ProductsTable } from "./ProductsTable";
import { ProductTableSkeleton } from "./ProductTableSkeleton";

export interface CollectionProductsProps extends PageListProps, ListActions {
  collection: CollectionDetailsQuery["collection"];
  onProductUnassign: (id: string, event: React.MouseEvent<any>) => void;
  onAdd: () => void;
}

const CollectionProducts: React.FC<CollectionProductsProps> = props => {
  const {
    collection,
    disabled,
    onAdd,
    onProductUnassign,
    isChecked,
    selected,
    toggle,
    toggleAll,
    toolbar,
  } = props;
  const intl = useIntl();
  const products = mapEdgesToItems(collection?.products);
  const numberOfColumns = products?.length === 0 ? 4 : 5;

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {collection ? (
            intl.formatMessage(
              {
                id: "/dnWE8",
                defaultMessage: "Products in {name}",
                description: "products in collection",
              },
              {
                name: collection?.name ?? "...",
              },
            )
          ) : (
            <Skeleton />
          )}
        </DashboardCard.Title>
        <DashboardCard.Toolbar>
          <Button
            data-test-id="add-product"
            disabled={disabled}
            variant="secondary"
            onClick={onAdd}
          >
            <FormattedMessage id="scHVdW" defaultMessage="Assign product" description="button" />
          </Button>
        </DashboardCard.Toolbar>
      </DashboardCard.Header>

      {products ? (
        <ProductsTable
          selected={selected}
          products={products || []}
          isChecked={isChecked}
          toggle={toggle}
          toggleAll={toggleAll}
          disabled={disabled}
          onProductUnassign={onProductUnassign}
          numberOfColumns={numberOfColumns}
          toolbar={toolbar}
        />
      ) : (
        <ProductTableSkeleton />
      )}
    </DashboardCard>
  );
};

CollectionProducts.displayName = "CollectionProducts";
export default CollectionProducts;
