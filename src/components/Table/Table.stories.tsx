import type { Meta, StoryObj } from "@storybook/react-vite";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "./Table";

const rows = [
  { id: "1", name: "Hoodie", price: "$45", qty: 12 },
  { id: "2", name: "T-Shirt", price: "$20", qty: 140 },
  { id: "3", name: "Sneakers", price: "$120", qty: 3 },
];

const Content = ({ footer }: { footer?: boolean }) => (
  <>
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <input type="checkbox" readOnly />
        </TableCell>
        <TableCell>Name</TableCell>
        <TableCell align="right">Price</TableCell>
        <TableCell align="center">Quantity</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map(row => (
        <TableRow key={row.id} hover>
          <TableCell padding="checkbox">
            <input type="checkbox" readOnly />
          </TableCell>
          <TableCell>{row.name}</TableCell>
          <TableCell align="right">{row.price}</TableCell>
          <TableCell align="center">{row.qty}</TableCell>
        </TableRow>
      ))}
    </TableBody>
    {footer && (
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Footer row</TableCell>
        </TableRow>
      </TableFooter>
    )}
  </>
);

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};

export default meta;
type Story = StoryObj<typeof Table>;

/** Bare table — cells keep the 56px row height and 32px gutters. */
export const Default: Story = {
  render: () => (
    <Table>
      <Content footer />
    </Table>
  ),
};

/** How nearly every list in the dashboard renders: wrapped in `ResponsiveTable`,
 * whose CSS module tightens the cell padding. */
export const InsideResponsiveTable: Story = {
  render: () => (
    <ResponsiveTable>
      <Content />
    </ResponsiveTable>
  ),
};

export const SelectedRow: Story = {
  render: () => (
    <ResponsiveTable>
      <TableBody>
        <TableRow hover>
          <TableCell>Not selected</TableCell>
        </TableRow>
        <TableRow hover selected>
          <TableCell>Selected</TableCell>
        </TableRow>
      </TableBody>
    </ResponsiveTable>
  ),
};
