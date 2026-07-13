import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import { buildOrderLineLifecycle } from "../../utils/buildOrderLineLifecycle";
import { OrderLineMatrixDatagrid } from "./OrderLineMatrixDatagrid";

const order = OrderFixture.fulfilled().build();
const lifecycleRows = buildOrderLineLifecycle(order);

const meta: Meta<typeof OrderLineMatrixDatagrid> = {
  title: "Orders/OrderLineMatrixDatagrid",
  component: OrderLineMatrixDatagrid,
  args: {
    order,
    lines: lifecycleRows,
    loading: false,
    expandedLineId: null,
    onToggleExpand: fn(),
    onOrderLineShowMetadata: fn(),
  },
  parameters: {
    chromatic: STORYBOOK_CHROMATIC_PARAMS.datagrid,
  },
};

export default meta;
type Story = StoryObj<typeof OrderLineMatrixDatagrid>;

export const Default: Story = {};

export const ExpandedRow: Story = {
  args: {
    expandedLineId: lifecycleRows[0]?.orderLineId,
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
