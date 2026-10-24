import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";

import { type OrderSettingsFormData } from "../OrderSettingsPage/types";
import { OrderCheckoutStockSettings } from "./OrderCheckoutStockSettings";

const baseData: OrderSettingsFormData = {
  fulfillmentAutoApprove: false,
  fulfillmentAllowUnpaid: false,
  reserveStockDurationAnonymousUser: 200,
  reserveStockDurationAuthenticatedUser: 400,
  limitQuantityPerCheckout: 50,
  channels: {},
};

const meta: Meta<typeof OrderCheckoutStockSettings> = {
  title: "Orders/OrderCheckoutStockSettings",
  component: OrderCheckoutStockSettings,
  args: { data: baseData, disabled: false },
  render: function Render({
    data: initialData,
    disabled,
  }: ComponentProps<typeof OrderCheckoutStockSettings>) {
    const [data, setData] = useState<OrderSettingsFormData>(initialData);

    return (
      <OrderCheckoutStockSettings
        data={data}
        disabled={disabled}
        onChange={({ target }) => setData(prev => ({ ...prev, [target.name]: target.value }))}
      />
    );
  },
};

export default meta;
type Story = StoryObj<typeof OrderCheckoutStockSettings>;

export const BothEnabled: Story = {};

export const BothDisabled: Story = {
  args: {
    data: {
      ...baseData,
      reserveStockDurationAnonymousUser: 0,
      reserveStockDurationAuthenticatedUser: 0,
    },
  },
};

export const AuthenticatedOnly: Story = {
  args: { data: { ...baseData, reserveStockDurationAnonymousUser: 0 } },
};

export const Disabled: Story = {
  args: { disabled: true },
};
