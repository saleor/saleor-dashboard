import {
  orderSettings as orderSettingsFixture,
  shopOrderSettings as shopOrderSettingsFixture
} from "@saleor/orders/fixtures";
import React from "react";

import Decorator from "../../../storybook/Decorator";
import OrderSettings, { OrderSettingsPageProps } from ".";

const props: OrderSettingsPageProps = {
  orderSettings: orderSettingsFixture,
  shop: shopOrderSettingsFixture,
  disabled: false,
  onBack: () => undefined,
  onSubmit: () => undefined,
  saveButtonBarState: "default"
};

export default {
  title: "Views / Orders / Order settings",
  decorators: [Decorator]
};

export const Default = () => <OrderSettings {...props} />;

Default.story = {
  name: "default"
};

export const Loading = () => (
  <OrderSettings
    {...props}
    disabled={true}
    orderSettings={undefined}
    shop={undefined}
  />
);

Loading.story = {
  name: "loading"
};
