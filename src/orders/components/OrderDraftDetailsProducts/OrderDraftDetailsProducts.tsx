import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Placeholder } from "@dashboard/components/Placeholder";
import { type OrderDetailsFragment, type OrderErrorFragment } from "@dashboard/graphql";
import { makeStyles } from "@saleor/macaw-ui";
import { Skeleton } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "../OrderDraftDetailsDatagrid/messages";
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
  orderLineRemoveConfirmState?: ConfirmButtonTransitionState;
  orderLineRemoveErrors?: OrderErrorFragment[];
  onOrderLineChange: (id: string, data: FormData) => void;
  onOrderLineRemove: (id: string) => void;
  onOrderLineShowMetadata: (id: string) => void;
}

const OrderDraftDetailsProducts = ({
  order,
  errors,
  loading,
  orderLineRemoveConfirmState,
  orderLineRemoveErrors,
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

  if (lines.length === 0) {
    return (
      <Placeholder>
        <FormattedMessage {...messages.emptyText} />
      </Placeholder>
    );
  }

  return (
    <OrderDraftDetailsDatagrid
      lines={lines}
      loading={loading}
      onOrderLineRemove={onOrderLineRemove}
      onOrderLineChange={onOrderLineChange}
      errors={formErrors}
      orderLineRemoveConfirmState={orderLineRemoveConfirmState}
      orderLineRemoveErrors={orderLineRemoveErrors}
      onOrderLineShowMetadata={onOrderLineShowMetadata}
    />
  );
};

OrderDraftDetailsProducts.displayName = "OrderDraftDetailsProducts";
export default OrderDraftDetailsProducts;
