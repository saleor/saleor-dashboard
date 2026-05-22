import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";
import { fn } from "storybook/test";

import { ColorPicker } from "./ColorPicker";

type Props = ComponentProps<typeof ColorPicker>;

const meta: Meta<typeof ColorPicker> = {
  title: "Components/ColorPicker",
  component: ColorPicker,
  args: {
    data: { value: "#3F51B5" },
    errors: {},
    onColorChange: fn(),
    setError: fn(),
    clearErrors: fn(),
  },
  argTypes: {
    onColorChange: { table: { disable: true } },
    setError: { table: { disable: true } },
    clearErrors: { table: { disable: true } },
  },
  render: (args: Props) => {
    const Wrapper = () => {
      const [value, setValue] = useState((args.data as { value: string }).value);

      return (
        <ColorPicker
          {...args}
          data={{ value }}
          onColorChange={hex => {
            setValue(hex);
            args.onColorChange(hex);
          }}
        />
      );
    };

    return <Wrapper />;
  },
};

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    data: { value: "#zzz" },
    errors: { value: "Invalid color value" },
  },
};
