import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { fn } from "storybook/test";

import { ControlledCheckbox } from "./ControlledCheckbox";

type Props = ComponentProps<typeof ControlledCheckbox>;

const meta: Meta<typeof ControlledCheckbox> = {
  title: "Components/ControlledCheckbox",
  component: ControlledCheckbox,
  args: {
    name: "controlled-checkbox",
    label: "Subscribe to newsletter",
    checked: false,
    onChange: fn(),
  },
  render: (args: Props) => {
    const Wrapper = () => {
      const [checked, setChecked] = useState(args.checked);

      return (
        <ControlledCheckbox
          {...args}
          checked={checked}
          onChange={event => {
            setChecked(event.target.value);
            args.onChange(event);
          }}
        />
      );
    };

    return <Wrapper />;
  },
};

export default meta;
type Story = StoryObj<typeof ControlledCheckbox>;

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
