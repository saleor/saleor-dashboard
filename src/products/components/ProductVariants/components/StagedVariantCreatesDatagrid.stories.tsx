import { type ChannelData } from "@dashboard/channels/utils";
import { type ProductVariantBulkCreateInput, type WarehouseFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { StagedVariantCreatesDatagrid } from "./StagedVariantCreatesDatagrid";

const creates: ProductVariantBulkCreateInput[] = [
  { name: "Red / S", sku: "RED-S", attributes: [{ id: "color", values: ["red"] }] },
  { name: "Blue / M", sku: "BLUE-M", attributes: [{ id: "color", values: ["blue"] }] },
];

const channels: ChannelData[] = [
  {
    id: "ch1",
    name: "Channel USD",
    currency: "USD",
    price: "10",
    variantsIds: [],
  } as ChannelData,
];

const warehouses: WarehouseFragment[] = [
  { id: "wh1", name: "Main warehouse", __typename: "Warehouse" } as WarehouseFragment,
];

const meta: Meta<typeof StagedVariantCreatesDatagrid> = {
  title: "Products/StagedVariantCreatesDatagrid",
  component: StagedVariantCreatesDatagrid,
};

export default meta;
type Story = StoryObj<typeof StagedVariantCreatesDatagrid>;

export const Default: Story = {
  args: {
    creates,
    channels,
    warehouses,
    onReplaceCreates: fn(),
    onRemoveIndexes: fn(),
    onClearAll: fn(),
  },
};
