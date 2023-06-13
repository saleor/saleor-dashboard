import Skeleton from "@dashboard/components/Skeleton";
import {
  OrderDetailsFragment,
  OrderErrorFragment,
  SearchAvailableInGridAttributesQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { OrderDraftDetailsDatagrid } from "../OrderDraftDetailsDatagrid/OrderDraftDetailsDatagrid";
export interface FormData {
  quantity: number;
}

const useStyles = makeStyles(
  theme => ({
    skeleton: {
      margin: theme.spacing(0, 4),
    },
  }),
  { name: "OrderDraftDetailsProducts" },
);

interface OrderDraftDetailsProductsProps {
  order?: OrderDetailsFragment;
  errors: OrderErrorFragment[];
  loading: boolean;
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
  availableInGridAttributes: {
    data: RelayToFlat<SearchAvailableInGridAttributesQuery["availableInGrid"]>;
    loading: boolean;
    hasMore: boolean;
    query: string;
    search: (query: string) => void;
    loadMore: () => void;
  };
}

const OrderDraftDetailsProducts: React.FC<OrderDraftDetailsProductsProps> = ({
  order,
  errors,
  loading,
  onOrderLineChange,
  onOrderLineRemove,
  availableInGridAttributes,
}) => {
  const classes = useStyles();

  const lines = order?.lines ?? [];
  const formErrors = errors.filter(error => error.field === "lines");

  if (order === undefined) {
    return <Skeleton className={classes.skeleton} />;
  }

  return (
    <OrderDraftDetailsDatagrid
      lines={lines}
      loading={loading}
      onOrderLineRemove={onOrderLineRemove}
      onOrderLineChange={onOrderLineChange}
      errors={formErrors}
      availableInGridAttributes={availableInGridAttributes}
    />
  );
};

OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
