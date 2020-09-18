import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderDraftCancelDialog, {
  OrderDraftCancelDialogProps
} from "../../../orders/components/OrderDraftCancelDialog";
import Decorator from "../../Decorator";

const props: OrderDraftCancelDialogProps = {
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  orderNumber: "4"
};

storiesOf("Orders / OrderDraftCancelDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderDraftCancelDialog {...props} />)
  .add("errors", () => (
    <OrderDraftCancelDialog
      {...props}
      errors={[
        {
          __typename: "OrderError",
          code: OrderErrorCode.GRAPHQL_ERROR,
          field: null
        }
      ]}
    />
  ));
