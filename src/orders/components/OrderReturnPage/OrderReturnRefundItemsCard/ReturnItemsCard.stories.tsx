import { order as orderFixture } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  type FormsetLineReasonData,
  type FormsetQuantityData,
  type FormsetReplacementData,
  type LineItemData,
} from "../form";
import ItemsCard from "./ReturnItemsCard";

const placeholderImage = "https://via.placeholder.com/64";
const order = orderFixture(placeholderImage);
const lines = order.lines.slice(0, 3);

const lineData = (id: string): LineItemData => ({
  isFulfillment: false,
  isRefunded: false,
  orderLineId: id,
});

const quantities = (getValue: (id: string) => number): FormsetQuantityData =>
  lines.map(line => ({
    id: line.id,
    label: line.productName,
    data: lineData(line.id),
    value: getValue(line.id),
  }));

const selections = (getValue: (id: string) => boolean): FormsetReplacementData =>
  lines.map(line => ({
    id: line.id,
    label: line.productName,
    data: lineData(line.id),
    value: getValue(line.id),
  }));

const lineReasons: FormsetLineReasonData = lines.map(line => ({
  id: line.id,
  label: line.productName,
  data: lineData(line.id),
  value: { reason: "", reasonReference: "" },
}));

const meta: Meta<typeof ItemsCard> = {
  title: "Orders/OrderReturnPage/ReturnItemsCard",
  component: ItemsCard,
  args: {
    lines,
    order,
    errors: [],
    itemsQuantities: quantities(() => 0),
    itemsSelections: selections(() => false),
    lineReasons,
    reasonReferenceTypeId: "",
    onChangeQuantity: fn(),
    onChangeSelected: fn(),
    onChangeLineReason: fn(),
    onSetMaxQuantity: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ItemsCard>;

/** Unfulfilled lines — no replacement column. */
export const Default: Story = {};

/** Fulfilled lines can be swapped for a replacement instead of refunded. */
export const CanReplace: Story = {
  args: { canReplace: true, fulfilmentId: "fulfillment-1" },
};

export const WithQuantities: Story = {
  args: { itemsQuantities: quantities(() => 1) },
};

export const WithReplacements: Story = {
  args: {
    canReplace: true,
    fulfilmentId: "fulfillment-1",
    itemsQuantities: quantities(() => 1),
    itemsSelections: selections(id => id === lines[0].id),
  },
};

/** Refund reasons are only editable once a Model Type is configured. */
export const WithReasonReferences: Story = {
  args: {
    reasonReferenceTypeId: "UGFnZVR5cGU6MQ==",
    itemsQuantities: quantities(() => 1),
  },
};

export const Empty: Story = {
  args: { lines: [], itemsQuantities: [], itemsSelections: [], lineReasons: [] },
};
