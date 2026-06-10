import { TableBody } from "@material-ui/core";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { ResponsiveTable } from "../ResponsiveTable/ResponsiveTable";
import TableRowLink from "../TableRowLink";
import IconButtonTableCell from "./IconButtonTableCell";

const meta: Meta<typeof IconButtonTableCell> = {
  title: "Components/IconButtonTableCell",
  component: IconButtonTableCell,
  decorators: [
    (Story: ComponentType) => (
      <ResponsiveTable>
        <TableBody>
          <TableRowLink>
            <Story />
          </TableRowLink>
        </TableBody>
      </ResponsiveTable>
    ),
  ],
  args: {
    children: <Trash2 size={16} />,
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof IconButtonTableCell>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
