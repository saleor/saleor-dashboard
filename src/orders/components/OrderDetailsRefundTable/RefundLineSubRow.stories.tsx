import { GridTable } from "@dashboard/components/GridTable";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";

import { RefundLineSubRow } from "./RefundLineSubRow";

const meta: Meta<typeof RefundLineSubRow> = {
  title: "Orders/RefundLineSubRow",
  component: RefundLineSubRow,
  decorators: [
    (Story: ComponentType) => (
      <GridTable>
        <Story />
      </GridTable>
    ),
  ],
  args: {
    line: {
      id: "line-1",
      quantity: 2,
      productName: "Space Dust Navy Paint",
      variantName: "1l",
      thumbnailUrl: "https://placehold.co/64x64",
      reason: "Broken in shipping",
      reasonType: "Damaged",
    },
  },
};

export default meta;
type Story = StoryObj<typeof RefundLineSubRow>;

export const WithReason: Story = {};

export const ReasonReferenceOnly: Story = {
  args: {
    line: {
      id: "line-2",
      quantity: 1,
      productName: "Apple Juice",
      variantName: null,
      thumbnailUrl: "https://placehold.co/64x64",
      reason: null,
      reasonType: "Customer changed mind",
    },
  },
};

export const NoReason: Story = {
  args: {
    line: {
      id: "line-3",
      quantity: 3,
      productName: "Bean Juice",
      variantName: "Large",
      thumbnailUrl: null,
      reason: null,
      reasonType: null,
    },
  },
};
