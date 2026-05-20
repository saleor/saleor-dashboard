import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import FilterTab from "./FilterTab";
import FilterTabs from "./FilterTabs";

const meta: Meta<typeof FilterTabs> = {
  title: "Components/FilterTabs",
  component: FilterTabs,
};

export default meta;
type Story = StoryObj<typeof FilterTabs>;

const tabLabels = ["All", "Published", "Drafts", "Archived"];

export const Default: Story = {
  args: {
    currentTab: 0,
    children: tabLabels.map((label, index) => (
      <FilterTab key={label} label={label} value={index} onClick={fn()} selected={index === 0} />
    )),
  },
};

export const NoTabSelected: Story = {
  args: {
    currentTab: undefined,
    children: tabLabels.map((label, index) => (
      <FilterTab key={label} label={label} value={index} onClick={fn()} />
    )),
  },
};
