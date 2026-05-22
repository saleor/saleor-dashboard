import { TableBody, TableCell } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import TableRowLink from "./TableRowLink";

const meta: Meta<typeof TableRowLink> = {
  title: "Components/TableRowLink",
  component: TableRowLink,
  decorators: [
    (Story: ComponentType) => (
      <ResponsiveTable>
        <TableBody>
          <Story />
        </TableBody>
      </ResponsiveTable>
    ),
  ],
  args: {
    children: (
      <>
        <TableCell>Cell A</TableCell>
        <TableCell>Cell B</TableCell>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof TableRowLink>;

export const Default: Story = {};

export const WithClickHandler: Story = {
  args: {
    onClick: fn(),
  },
};

export const AsInternalLink: Story = {
  args: {
    href: "/products/123/",
  },
};

export const AsExternalLink: Story = {
  args: {
    href: "https://saleor.io",
  },
};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
