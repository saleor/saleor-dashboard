import { Meta, StoryObj } from "@storybook/react";
import { Text } from "../Text";
import { Checkbox } from "./index";

const meta: Meta<typeof Checkbox> = {
  title: "Components / Checkbox",
  tags: ["autodocs"],
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
  args: {
    children: [
      <Text size={2}>Option 1</Text>, // eslint-disable-line react/jsx-key
    ],
  },
};

export const Checked: Story = {
  args: {
    ...Primary.args,
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Primary.args,
    disabled: true,
    children: [
      // eslint-disable-next-line react/jsx-key
      <Text size={2} color="defaultDisabled">
        Option 1
      </Text>,
    ],
  },
};

export const Errored: Story = {
  args: {
    ...Primary.args,
    error: true,
  },
};

export const Indeterminate: Story = {
  args: {
    ...Primary.args,
    checked: "indeterminate",
  },
};

export const IndeterminateError: Story = {
  args: {
    ...Primary.args,
    checked: "indeterminate",
    error: true,
  },
};
