import { TableCell } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import SortableHandle from "./SortableHandle";
import { SortableTableBody } from "./SortableTableBody";
import { SortableTableRow } from "./SortableTableRow";

const meta: Meta<typeof SortableHandle> = {
  title: "Components/SortableHandle",
  component: SortableHandle,
};

export default meta;
type Story = StoryObj<typeof SortableHandle>;

export const Default: Story = {
  render: () => (
    <ResponsiveTable>
      <SortableTableBody onSortEnd={fn()}>
        <SortableTableRow index={0}>
          <TableCell>Sortable row with handle</TableCell>
        </SortableTableRow>
      </SortableTableBody>
    </ResponsiveTable>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ResponsiveTable>
      <SortableTableBody onSortEnd={fn()} disabled>
        <SortableTableRow index={0}>
          <TableCell>Disabled sortable row</TableCell>
        </SortableTableRow>
      </SortableTableBody>
    </ResponsiveTable>
  ),
};
