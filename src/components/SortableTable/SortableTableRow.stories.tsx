import { TableCell } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import { SortableTableBody } from "./SortableTableBody";
import { SortableTableRow } from "./SortableTableRow";

const meta: Meta<typeof SortableTableRow> = {
  title: "Components/SortableTableRow",
  component: SortableTableRow,
};

export default meta;
type Story = StoryObj<typeof SortableTableRow>;

export const Default: Story = {
  render: () => (
    <ResponsiveTable>
      <SortableTableBody onSortEnd={fn()}>
        <SortableTableRow index={0}>
          <TableCell>Sortable row content</TableCell>
        </SortableTableRow>
        <SortableTableRow index={1}>
          <TableCell>Second row</TableCell>
        </SortableTableRow>
      </SortableTableBody>
    </ResponsiveTable>
  ),
};

export const AsLink: Story = {
  render: () => (
    <ResponsiveTable>
      <SortableTableBody onSortEnd={fn()}>
        <SortableTableRow index={0} href="/products/123/">
          <TableCell>Sortable link row</TableCell>
        </SortableTableRow>
      </SortableTableBody>
    </ResponsiveTable>
  ),
};
