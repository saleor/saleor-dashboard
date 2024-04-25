import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
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
  onShowMetadata: (id: string) => void;
}

const OrderDraftDetailsProducts: React.FC<OrderDraftDetailsProductsProps> = ({
  order,
  errors,
  loading,
  onOrderLineChange,
  onOrderLineRemove,
  onShowMetadata,
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
      onShowMetadata={onShowMetadata}
    />
  );
};

OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
