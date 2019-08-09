import { storiesOf } from "@storybook/react";
import React from "react";

import OrderProductAddDialog from "../../../orders/components/OrderProductAddDialog";
import { orderLineSearch } from "../../../orders/fixtures";
import Decorator from "../../Decorator";
import placeholderImage from "../@assets/images/placeholder60x60.png";

storiesOf("Orders / OrderProductAddDialog", module)
  .addDecorator(Decorator)
  .add("default", () => (
    <OrderProductAddDialog
      confirmButtonState="default"
      loading={false}
      open={true}
      onClose={undefined}
      onSubmit={undefined}
      hasMore={false}
      onFetch={() => undefined}
      onFetchMore={() => undefined}
      products={orderLineSearch(placeholderImage)}
    />
  ));
