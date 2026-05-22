import { TableCell } from "@material-ui/core";
import { Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import TableHead from "./TableHead";

const items = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
];

const meta: Meta<typeof TableHead> = {
  title: "Components/TableHead",
  component: TableHead,
  decorators: [
    (Story: ComponentType) => (
      <ResponsiveTable>
        <Story />
      </ResponsiveTable>
    ),
  ],
  args: {
    colSpan: 3,
    disabled: false,
    selected: 0,
    items,
    toggleAll: fn(),
    children: (
      <>
        <TableCell>Name</TableCell>
        <TableCell>Status</TableCell>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof TableHead>;

export const Default: Story = {};

export const SomeSelected: Story = {
  args: {
    selected: 2,
    toolbar: (
      <Button variant="secondary" onClick={fn()}>
        Bulk delete
      </Button>
    ),
  },
};

export const AllSelected: Story = {
  args: {
    selected: items.length,
    toolbar: (
      <Button variant="secondary" onClick={fn()}>
        Bulk delete
      </Button>
    ),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Empty: Story = {
  args: {
    items: [],
  },
};

export const WithDragRows: Story = {
  args: {
    dragRows: true,
  },
};
