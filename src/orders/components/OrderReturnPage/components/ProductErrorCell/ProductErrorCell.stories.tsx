import { Table, TableBody, TableCell, TableRow } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";

import { ProductErrorCell } from "./ProductErrorCell";

const withTable = (Story: ComponentType) => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell>Sample product</TableCell>
        <Story />
      </TableRow>
    </TableBody>
  </Table>
);

const meta: Meta<typeof ProductErrorCell> = {
  title: "Orders/OrderReturnPage/ProductErrorCell",
  component: ProductErrorCell,
  decorators: [withTable],
};

export default meta;
type Story = StoryObj<typeof ProductErrorCell>;

export const MissingVariant: Story = {
  args: { hasVariant: false },
};

export const HasVariant: Story = {
  args: { hasVariant: true },
};
