import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Radio } from "./Radio";

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  args: {
    value: "option",
    checked: false,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Radio>;
type Props = ComponentProps<typeof Radio>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    checked: true,
  },
};

/** Clicking an unselected radio reports its value to the owner of the selection. */
export const SelectingCallsOnChange: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByRole("radio"));

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith("option");
  },
};

/** A disabled radio takes no pointer events, so the selection cannot move. */
export const DisabledDoesNotCallOnChange: Story = {
  args: { disabled: true },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const radio = canvas.getByRole("radio");

    // Act
    await userEvent.click(radio, { pointerEventsCheck: 0 });

    // Assert
    await expect(radio).toBeDisabled();
    await expect(args.onChange).not.toHaveBeenCalled();
  },
};

/** Radios are controlled, so the picked value moves only when the owner stores it. */
export const SelectionMovesBetweenRadios: Story = {
  render: function InteractiveRadios(args: Props) {
    const [selected, setSelected] = useState("first");

    return (
      <>
        {["first", "second"].map(value => (
          <Radio
            key={value}
            value={value}
            checked={selected === value}
            data-test-id={value}
            onChange={selectedValue => {
              setSelected(selectedValue);
              args.onChange?.(selectedValue);
            }}
          />
        ))}
      </>
    );
  },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const first = within(canvas.getByTestId("first")).getByRole("radio");
    const second = within(canvas.getByTestId("second")).getByRole("radio");

    await expect(first).toHaveAttribute("aria-checked", "true");

    // Act
    await userEvent.click(second);

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith("second");
    await expect(second).toHaveAttribute("aria-checked", "true");
    await expect(first).toHaveAttribute("aria-checked", "false");
  },
};
