// @ts-strict-ignore
import {
  orderSettings as orderSettingsFixture,
  shopOrderSettings as shopOrderSettingsFixture,
} from "@dashboard/orders/fixtures";
import React from "react";

import OrderSettings, { OrderSettingsPageProps } from "./OrderSettingsPage";

const props: OrderSettingsPageProps = {
  orderSettings: orderSettingsFixture,
  shop: shopOrderSettingsFixture,
  disabled: false,
  onSubmit: () => undefined,
  saveButtonBarState: "default",
};

export default {
  title: " Orders / Order settings",
};

export const Default = () => <OrderSettings {...props} />;

export const Loading = () => (
  <OrderSettings
    {...props}
    disabled={true}
    orderSettings={undefined}
    shop={undefined}
  />
);
