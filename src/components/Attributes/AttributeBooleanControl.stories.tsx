import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, useState } from "react";

import { AttributeBooleanControl } from "./AttributeBooleanControl";

const meta: Meta<typeof AttributeBooleanControl> = {
  title: "Components / AttributeBooleanControl",
  component: AttributeBooleanControl,
  args: {
    name: "waterproof",
    label: "Waterproof",
    value: null,
    onChange: () => undefined,
  },
  render: (args: ComponentProps<typeof AttributeBooleanControl>) => {
    const [value, setValue] = useState<boolean | null | undefined>(args.value);

    return <AttributeBooleanControl {...args} value={value} onChange={setValue} />;
  },
};

export default meta;

type Story = StoryObj<typeof AttributeBooleanControl>;

export const Optional: Story = {};

export const Required: Story = {
  args: {
    required: true,
    invalid: true,
  },
};

export const Yes: Story = {
  args: {
    value: true,
  },
};
