import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import { type Container } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

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
type Props = ComponentProps<typeof SingleSelectionRows>;

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

type SingleSelectionStory = StoryObj<typeof SingleSelectionRows>;

/** The rows own no state — picking a radio just reports the row id upwards. */
export const SingleSelectionPicksRow: SingleSelectionStory = {
  args: {
    containers,
    selectedItemId: "2",
    onSelect: fn(),
  },
  render: (args: Props) => (
    <ResponsiveTable bleed>
      <TableBody>
        <SingleSelectionRows {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const rows = canvas.getAllByTestId("dialog-row");
    const radioOf = (row: HTMLElement) => within(row).getByRole("radio");

    await expect(radioOf(rows[1])).toHaveAttribute("aria-checked", "true");

    // Act
    await userEvent.click(radioOf(rows[2]));

    // Assert
    await expect(args.onSelect).toHaveBeenCalledExactlyOnceWith("3");
  },
};
