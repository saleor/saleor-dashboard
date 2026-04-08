import { order } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { OrderDetailsDatagrid } from "./OrderDetailsDatagrid";

const placeholderImage = "https://via.placeholder.com/64";
const orderFixture = order(placeholderImage);

const meta: Meta<typeof OrderDetailsDatagrid> = {
  title: "Orders/OrderDetailsDatagrid",
  component: OrderDetailsDatagrid,

  args: {
    lines: orderFixture.lines,
    loading: false,
    onOrderLineShowMetadata: fn(),
  },
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof OrderDetailsDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const Empty: Story = {
  args: {
    lines: [],
  },
};

export const SingleLine: Story = {
  args: {
    lines: [orderFixture.lines[0]],
  },
};

export const WithGiftItem: Story = {
  args: {
    lines: [
      ...orderFixture.lines,
      {
        ...orderFixture.lines[0],
        id: "gift-line-id",
        productName: "Gift Card $50",
        isGift: true,
        quantity: 1,
      },
    ],
  },
};
