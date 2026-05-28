import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import FilterTab from "./FilterTab";
import FilterTabs from "./FilterTabs";

const meta: Meta<typeof FilterTab> = {
  title: "Components/FilterTab",
  component: FilterTab,
  decorators: [
    (Story: ComponentType) => (
      <FilterTabs currentTab={0}>
        <Story />
      </FilterTabs>
    ),
  ],
  args: {
    label: "All",
    onClick: fn(),
    value: 0,
  },
};

export default meta;
type Story = StoryObj<typeof FilterTab>;

export const Default: Story = {};

export const Selected: Story = {
  args: {
    selected: true,
  },
};
