import { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";

import { Box } from "..";

import { RangeInput, RangeValue } from ".";

const meta: Meta<typeof RangeInput> = {
  title: "Components / RangeInput",
  tags: ["autodocs"],
  component: RangeInput,
  args: {
    size: "large",
  },
};

export default meta;
type Story = StoryObj<typeof RangeInput>;

const Template: Story = {
  render: (args) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState<RangeValue>(["", ""]);

    return (
      <Box display="flex" gap={0.5} alignItems="center" flexWrap="wrap">
        <RangeInput
          {...args}
          value={value}
          onChange={(value) => setValue(value)}
        />
      </Box>
    );
  },
};

export const Default: Story = {
  ...Template,
  args: {
    type: "number",
  },
};

export const WithCustomDivider: Story = {
  ...Template,
  args: {
    type: "date",
    children: <Box paddingX={1}>to</Box>,
  },
};
