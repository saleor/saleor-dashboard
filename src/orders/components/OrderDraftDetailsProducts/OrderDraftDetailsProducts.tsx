import { OrderDetailsFragment, OrderErrorFragment } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";

import { OrderDraftDetailsDatagrid } from "../OrderDraftDetailsDatagrid/OrderDraftDetailsDatagrid";

export interface OrderDraftDetailsProductsFormData {
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
  onOrderLineChange: (id: string, data: OrderDraftDetailsProductsFormData) => void;
  onOrderLineRemove: (id: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
}

export const OrderDraftDetailsProducts = ({
  order,
  errors,
  loading,
  onOrderLineChange,
  onOrderLineRemove,
  onOrderLineShowMetadata,
}: OrderDraftDetailsProductsProps) => {
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
      onOrderLineShowMetadata={onOrderLineShowMetadata}
    />
  );
};
