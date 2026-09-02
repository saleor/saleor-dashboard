import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import {
  AssignPickerListEmptyState,
  AssignPickerListEmptyStateRow,
} from "./AssignPickerListEmptyState";

const meta: Meta<typeof AssignPickerListEmptyStateRow> = {
  title: "Components/AssignPickerListEmptyState",
  component: AssignPickerListEmptyStateRow,
};

export default meta;
type Story = StoryObj<typeof AssignPickerListEmptyStateRow>;

export const Row: Story = {
  render: (args: ComponentProps<typeof AssignPickerListEmptyStateRow>) => (
    <ResponsiveTable bleed>
      <TableBody>
        <AssignPickerListEmptyStateRow {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: { colSpan: 3, children: "No products found" },
};

/** Long copy wraps and stays centred. */
export const LongMessage: Story = {
  ...Row,
  args: {
    colSpan: 3,
    children:
      "No products matched your search. Try a different phrase, or clear the filters to see everything in this channel.",
  },
};

export const Standalone: Story = {
  render: () => <AssignPickerListEmptyState>No products found</AssignPickerListEmptyState>,
};
