import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import { type Container } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { MultiSelectionRows, SingleSelectionRows } from "./AssignContainerRows";

const containers: Container[] = [
  { id: "1", name: "Default Channel" },
  { id: "2", name: "Channel-PLN" },
  { id: "3", name: "Channel-EUR" },
];

const meta: Meta<typeof MultiSelectionRows> = {
  title: "Components/AssignContainerRows",
  component: MultiSelectionRows,
};

export default meta;
type Story = StoryObj<typeof MultiSelectionRows>;

export const MultiSelection: Story = {
  render: () => (
    <ResponsiveTable bleed>
      <TableBody>
        <MultiSelectionRows containers={containers} isSelected={id => id === "2"} onToggle={fn()} />
      </TableBody>
    </ResponsiveTable>
  ),
};

export const SingleSelection: Story = {
  render: () => (
    <ResponsiveTable bleed>
      <TableBody>
        <SingleSelectionRows containers={containers} selectedItemId="2" onSelect={fn()} />
      </TableBody>
    </ResponsiveTable>
  ),
};

export const Empty: Story = {
  render: () => (
    <ResponsiveTable bleed>
      <TableBody>
        <MultiSelectionRows containers={[]} isSelected={() => false} onToggle={fn()} />
      </TableBody>
    </ResponsiveTable>
  ),
};
