import {
  orderSettings as orderSettingsFixture,
  shopOrderSettings as shopOrderSettingsFixture,
} from "@saleor/orders/fixtures";
import { storiesOf } from "@storybook/react";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import OrderSettings, { OrderSettingsPageProps } from ".";

const props: OrderSettingsPageProps = {
  orderSettings: orderSettingsFixture,
  shop: shopOrderSettingsFixture,
  disabled: false,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

storiesOf("Views / Orders / Order settings", module)
  .addDecorator(Decorator)
  .add("default", () => <OrderSettings {...props} />)
  .add("loading", () => (
    <OrderSettings
      {...props}
      disabled={true}
      orderSettings={undefined}
      shop={undefined}
    />
  ));
