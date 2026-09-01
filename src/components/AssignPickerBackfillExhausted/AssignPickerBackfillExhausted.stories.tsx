import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { AssignPickerBackfillExhaustedRow } from "./AssignPickerBackfillExhausted";

const meta: Meta<typeof AssignPickerBackfillExhaustedRow> = {
  title: "Components/AssignPickerBackfillExhausted",
  component: AssignPickerBackfillExhaustedRow,
  render: (args: ComponentProps<typeof AssignPickerBackfillExhaustedRow>) => (
    <ResponsiveTable bleed>
      <TableBody>
        <AssignPickerBackfillExhaustedRow {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: {
    colSpan: 3,
    message: "Every product loaded so far is already assigned.",
    buttonLabel: "Load more products",
    onLoadMore: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignPickerBackfillExhaustedRow>;

export const Default: Story = {};

/** While the next page is in flight the button is disabled, not swapped out. */
export const Loading: Story = {
  args: { loading: true },
};
