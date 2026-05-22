import { TableCell, TableHead, TableRow } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import { SortableTableBody } from "./SortableTableBody";
import { SortableTableRow } from "./SortableTableRow";

const rows = [
  { id: "1", label: "Item one" },
  { id: "2", label: "Item two" },
  { id: "3", label: "Item three" },
];

type Props = ComponentProps<typeof SortableTableBody>;

const renderRows = () =>
  rows.map((row, index) => (
    <SortableTableRow key={row.id} index={index}>
      <TableCell>{row.label}</TableCell>
    </SortableTableRow>
  ));

const meta: Meta<typeof SortableTableBody> = {
  title: "Components/SortableTableBody",
  component: SortableTableBody,
  args: {
    onSortEnd: fn(),
  },
  render: (args: Props) => (
    <ResponsiveTable>
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Label</TableCell>
        </TableRow>
      </TableHead>
      <SortableTableBody {...args}>{renderRows()}</SortableTableBody>
    </ResponsiveTable>
  ),
};

export default meta;
type Story = StoryObj<typeof SortableTableBody>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
