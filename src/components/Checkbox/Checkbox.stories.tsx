import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import Checkbox from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  args: {
    checked: false,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
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

export const WithHelperText: Story = {
  args: {
    helperText: "Helpful description for the checkbox",
  },
};

export const Error: Story = {
  args: {
    error: true,
    helperText: "This field is required",
  },
};
