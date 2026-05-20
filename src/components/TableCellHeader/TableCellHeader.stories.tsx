import { TableHead, TableRow } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import TableCellHeader from "./TableCellHeader";

const meta: Meta<typeof TableCellHeader> = {
  title: "Components/TableCellHeader",
  component: TableCellHeader,
  decorators: [
    (Story: ComponentType) => (
      <ResponsiveTable>
        <TableHead>
          <TableRow>
            <Story />
          </TableRow>
        </TableHead>
      </ResponsiveTable>
    ),
  ],
  args: {
    children: "Column",
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof TableCellHeader>;

export const Default: Story = {};

export const SortedAscending: Story = {
  args: {
    direction: "asc",
  },
};

export const SortedDescending: Story = {
  args: {
    direction: "desc",
  },
};

export const ArrowRight: Story = {
  args: {
    direction: "asc",
    arrowPosition: "right",
  },
};

export const NotSortable: Story = {
  args: {
    onClick: undefined,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AlignedRight: Story = {
  args: {
    textAlign: "right",
  },
};
