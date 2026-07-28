import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, BarChart3 } from "lucide-react";
import { useState } from "react";
import { fn } from "storybook/test";

import {
  InsetSegmentedControl,
  type InsetSegmentedControlOption,
  type InsetSegmentedControlProps,
  insetSegmentLabel,
} from "./InsetSegmentedControl";

type ViewMode = "financial" | "operations";

const VIEW_OPTIONS: InsetSegmentedControlOption<ViewMode>[] = [
  {
    value: "financial",
    label: isActive => (
      <Box display="flex" alignItems="center" gap={1.5}>
        <BarChart3 size={14} />
        {insetSegmentLabel(isActive, "Financial")}
      </Box>
    ),
  },
  {
    value: "operations",
    label: isActive => (
      <Box display="flex" alignItems="center" gap={1.5}>
        <Activity size={14} />
        {insetSegmentLabel(isActive, "Operations")}
      </Box>
    ),
  },
];

const meta: Meta<typeof InsetSegmentedControl<ViewMode>> = {
  title: "Components / InsetSegmentedControl",
  component: InsetSegmentedControl,
  args: {
    options: VIEW_OPTIONS,
    value: "financial",
    onChange: fn(),
    size: "md",
    "aria-label": "View mode",
  },
};

export default meta;
type Story = StoryObj<typeof InsetSegmentedControl<ViewMode>>;

export const Default: Story = {};

export const WithIcons: Story = {
  args: {
    size: "lg",
    options: VIEW_OPTIONS,
  },
};

export const TextOnly: Story = {
  args: {
    options: [
      { value: "financial", label: "Financial" },
      { value: "operations", label: "Operations" },
    ],
  },
};

export const Interactive: Story = {
  render: (args: InsetSegmentedControlProps<ViewMode>) => {
    const [value, setValue] = useState<ViewMode>("financial");

    return (
      <InsetSegmentedControl<ViewMode>
        {...args}
        options={VIEW_OPTIONS}
        value={value}
        onChange={setValue}
        size="lg"
      />
    );
  },
};
