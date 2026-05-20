import { TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { ResponsiveTable } from "./ResponsiveTable";

const rows = [
  { id: "1", name: "Hoodie", price: "$45" },
  { id: "2", name: "T-Shirt", price: "$20" },
  { id: "3", name: "Sneakers", price: "$120" },
];

const tableContent = (
  <>
    <TableHead>
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>Price</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id}>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.price}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </>
);

const meta: Meta<typeof ResponsiveTable> = {
  title: "Components/ResponsiveTable",
  component: ResponsiveTable,
  args: {
    children: tableContent,
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveTable>;

export const Default: Story = {};

export const WithSearch: Story = {
  args: {
    search: {
      placeholder: "Search products",
      onSearchChange: fn(),
    },
  },
};

export const SearchEmptyResults: Story = {
  args: {
    search: {
      placeholder: "Search products",
      initialValue: "missing",
      onSearchChange: fn(),
    },
    filteredItemsCount: 0,
  },
};

export const WithFooter: Story = {
  args: {
    footer: <div>1 - 3 of 3</div>,
  },
};
