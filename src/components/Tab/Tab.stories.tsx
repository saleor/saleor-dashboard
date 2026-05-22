import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Tab } from "./Tab";

const DemoTab = Tab<string>("demo-tab");

const meta: Meta<typeof DemoTab> = {
  title: "Components/Tab",
  component: DemoTab,
  args: {
    children: "Tab label",
    isActive: false,
    changeTab: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof DemoTab>;

export const Default: Story = {};

export const Active: Story = {
  args: {
    isActive: true,
  },
};
