import { order } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { OrderDraftDetailsDatagrid } from "./OrderDraftDetailsDatagrid";

const placeholderImage = "https://via.placeholder.com/64";
const orderFixture = order(placeholderImage);

const meta: Meta<typeof OrderDraftDetailsDatagrid> = {
  title: "Orders/OrderDraftDetailsDatagrid",
  component: OrderDraftDetailsDatagrid,
  args: {
    lines: orderFixture.lines,
    loading: false,
    errors: [],
    onOrderLineChange: fn(),
    onOrderLineRemove: fn(),
    onOrderLineShowMetadata: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OrderDraftDetailsDatagrid>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { lines: [] },
};
