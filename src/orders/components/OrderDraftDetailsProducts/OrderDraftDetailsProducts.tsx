import Skeleton from "@dashboard/components/Skeleton";
import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

import { OrderDraftDetailsDatagrid } from "./OrderDraftDetailsDatagrid";
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
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
}

const OrderDraftDetailsProducts: React.FC<OrderDraftDetailsProductsProps> = ({
  order,
  errors,
  onOrderLineChange,
  onOrderLineRemove,
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
      loading={false}
      onOrderLineRemove={onOrderLineRemove}
      onOrderLineChange={onOrderLineChange}
      errors={formErrors}
    />
  );
};

OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
