import {
  orderSettings as orderSettingsFixture,
  shopOrderSettings as shopOrderSettingsFixture,
} from "@saleor/orders/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { storiesOf } from "@storybook/react";
import React from "react";

import OrderSettings, { OrderSettingsPageProps } from "./OrderSettingsPage";

const props: OrderSettingsPageProps = {
  orderSettings: orderSettingsFixture,
  shop: shopOrderSettingsFixture,
  disabled: false,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

storiesOf(" Orders / Order settings", module)
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
