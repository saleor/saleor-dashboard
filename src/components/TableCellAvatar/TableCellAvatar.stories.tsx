import { TableBody, TableCell } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import TableRowLink from "../TableRowLink";
import TableCellAvatar from "./TableCellAvatar";

const meta: Meta<typeof TableCellAvatar> = {
  title: "Components/TableCellAvatar",
  component: TableCellAvatar,
  decorators: [
    (Story: ComponentType) => (
      <ResponsiveTable>
        <TableBody>
          <TableRowLink>
            <Story />
            <TableCell>Row label</TableCell>
          </TableRowLink>
        </TableBody>
      </ResponsiveTable>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableCellAvatar>;

export const Default: Story = {
  args: {
    thumbnail: "https://via.placeholder.com/40",
  },
};

export const WithInitials: Story = {
  args: {
    initials: "JD",
  },
};

export const EmptyPlaceholder: Story = {};

export const AlignRight: Story = {
  args: {
    thumbnail: "https://via.placeholder.com/40",
    alignRight: true,
  },
};
