import { Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { RadioSwitchField } from "./RadioSwitchField";

const meta: Meta<typeof RadioSwitchField> = {
  title: "Components/RadioSwitchField",
  component: RadioSwitchField,
  args: {
    name: "isAvailableForPurchase",
    value: true,
    firstOptionLabel: <Text>Available for purchase</Text>,
    secondOptionLabel: <Text>Unavailable for purchase</Text>,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RadioSwitchField>;
type Props = ComponentProps<typeof RadioSwitchField>;

export const Default: Story = {};

export const SecondOptionSelected: Story = {
  args: { value: false },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Error: Story = {
  args: { error: true },
};

/** The field speaks booleans: picking the second option reports `false` under its name. */
export const PickingSecondOptionReportsFalse: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByLabelText("Unavailable for purchase"));

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith({
      target: { name: "isAvailableForPurchase", value: false },
    });
  },
};

export const PickingFirstOptionReportsTrue: Story = {
  args: { value: false },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(canvas.getByLabelText("Available for purchase"));

    // Assert
    await expect(args.onChange).toHaveBeenCalledExactlyOnceWith({
      target: { name: "isAvailableForPurchase", value: true },
    });
  },
};

/** The field is controlled, so the checked option follows the value the owner stores. */
export const SelectionFollowsStoredValue: Story = {
  render: function ControlledRadioSwitchField(args: Props) {
    const [value, setValue] = useState(true);

    return (
      <RadioSwitchField
        {...args}
        value={value}
        onChange={event => {
          setValue(event.target.value);
          args.onChange(event);
        }}
      />
    );
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);
    const available = canvas.getByLabelText("Available for purchase");
    const unavailable = canvas.getByLabelText("Unavailable for purchase");

    await expect(available).toHaveAttribute("aria-checked", "true");

    // Act
    await userEvent.click(unavailable);

    // Assert
    await expect(unavailable).toHaveAttribute("aria-checked", "true");
    await expect(available).toHaveAttribute("aria-checked", "false");
  },
};
