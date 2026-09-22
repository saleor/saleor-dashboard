import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import { AttributeListTableSkeletonRows } from "./AttributeListTableSkeleton";

const meta: Meta<typeof AttributeListTableSkeletonRows> = {
  title: "Attributes/AttributeListTableSkeleton",
  component: AttributeListTableSkeletonRows,
  render: (args: ComponentProps<typeof AttributeListTableSkeletonRows>) => (
    <ResponsiveTable>
      <TableBody>
        <AttributeListTableSkeletonRows {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
};

export default meta;
type Story = StoryObj<typeof AttributeListTableSkeletonRows>;

export const Default: Story = {};

export const SingleRow: Story = {
  args: { rowCount: 1 },
};

export const ManyRows: Story = {
  args: { rowCount: 8 },
};

/** Matches a table whose last column holds a selection control. */
export const SelectionColumn: Story = {
  args: { variantColumn: "selection" },
};

/** Matches a table whose last column is only there to reserve the action inset. */
export const SpacerColumn: Story = {
  args: { variantColumn: "spacer" },
};
