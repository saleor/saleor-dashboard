import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderMarkAsPaidDialog, {
  OrderMarkAsPaidDialogProps
} from "../../../orders/components/OrderMarkAsPaidDialog";
import Decorator from "../../Decorator";

const props: OrderMarkAsPaidDialogProps = {
  confirmButtonState: "default",
  errors: [],
  handleTransactionReference: () => undefined,
  onClose: () => undefined,
  onConfirm: () => undefined,
  open: true,
  transactionReference: ""
};

storiesOf("Orders / OrderMarkAsPaidDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderMarkAsPaidDialog {...props} />)
  .add("errors", () => (
    <OrderMarkAsPaidDialog
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
