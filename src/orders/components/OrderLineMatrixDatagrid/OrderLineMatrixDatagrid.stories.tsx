import { OrderFixture } from "@dashboard/orders/fixtures/OrderFixture";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../../storybook/chromatic";
import {
  buildOrderLineLifecycle,
  type OrderLineLifecycle,
} from "../../utils/buildOrderLineLifecycle";
import { OrderLineMatrixDatagrid } from "./OrderLineMatrixDatagrid";

const order = OrderFixture.fulfilled().build();
const lifecycleRows = buildOrderLineLifecycle(order);

interface PriceAmounts {
  gross: { amount: number };
  net: { amount: number };
}

const withAmount = <T extends PriceAmounts>(price: T, amount: number): T => ({
  ...price,
  gross: { ...price.gross, amount },
  net: { ...price.net, amount },
});

/** Discount every line to `unit` from `undiscountedUnit`. */
const withDiscountedUnitPrice = (
  rows: OrderLineLifecycle[],
  { unit, undiscountedUnit }: { unit: number; undiscountedUnit: number },
): OrderLineLifecycle[] =>
  rows.map(row => {
    const { orderLine } = row;

    return {
      ...row,
      orderLine: {
        ...orderLine,
        unitPrice: withAmount(orderLine.unitPrice, unit),
        undiscountedUnitPrice: withAmount(orderLine.undiscountedUnitPrice, undiscountedUnit),
        totalPrice: withAmount(orderLine.totalPrice, unit * orderLine.quantity),
        undiscountedTotalPrice: withAmount(
          orderLine.undiscountedTotalPrice,
          undiscountedUnit * orderLine.quantity,
        ),
      },
    };
  });

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

export const DiscountedFourDigitPrices: Story = {
  args: {
    lines: withDiscountedUnitPrice(lifecycleRows, { unit: 709.32, undiscountedUnit: 1222.2 }),
    onShowLinePriceBreakdown: fn(),
  },
};

export const DiscountedFiveDigitPrices: Story = {
  args: {
    lines: withDiscountedUnitPrice(lifecycleRows, { unit: 10450, undiscountedUnit: 12950 }),
    onShowLinePriceBreakdown: fn(),
  },
};
