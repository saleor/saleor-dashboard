import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell, TableRow } from "@dashboard/components/Table/Table";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import { AssignPickerListLoading, AssignPickerListLoadingRow } from "./AssignPickerListLoading";

const meta: Meta<typeof AssignPickerListLoadingRow> = {
  title: "Components/AssignPickerListLoading",
  component: AssignPickerListLoadingRow,
};

export default meta;
type Story = StoryObj<typeof AssignPickerListLoadingRow>;

/** As it renders inside a picker table — the throbber cell spans every column. */
export const Row: Story = {
  render: (args: ComponentProps<typeof AssignPickerListLoadingRow>) => (
    <ResponsiveTable bleed>
      <TableBody>
        <AssignPickerListLoadingRow {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: { colSpan: 3 },
};

/** Same placeholder next to real rows, so the reserved height is visible. */
export const RowAmongResults: Story = {
  render: () => (
    <ResponsiveTable bleed>
      <TableBody>
        <TableRow>
          <TableCell colSpan={3}>Hoodie</TableCell>
        </TableRow>
        <AssignPickerListLoadingRow colSpan={3} />
      </TableBody>
    </ResponsiveTable>
  ),
};

/** The bare container, used outside a table. */
export const Standalone: Story = {
  render: () => <AssignPickerListLoading />,
};
