import placeholderImage from "@assets/images/placeholder60x60.png";
import { fetchMoreProps } from "@saleor/fixtures";
import { OrderErrorCode } from "@saleor/types/globalTypes";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderProductAddDialog, {
  OrderProductAddDialogProps
} from "../../../orders/components/OrderProductAddDialog";
import { orderLineSearch } from "../../../orders/fixtures";
import Decorator from "../../Decorator";

const props: OrderProductAddDialogProps = {
  ...fetchMoreProps,
  confirmButtonState: "default",
  errors: [],
  onClose: () => undefined,
  onFetch: () => undefined,
  onSubmit: () => undefined,
  open: true,
  products: orderLineSearch(placeholderImage)
};

storiesOf("Orders / OrderProductAddDialog", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderProductAddDialog {...props} />)
  .add("errors", () => (
    <OrderProductAddDialog
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
