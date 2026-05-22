import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pencil, Trash2 } from "lucide-react";
import { fn } from "storybook/test";

import CardMenu from "./CardMenu";

const meta: Meta<typeof CardMenu> = {
  title: "Components/CardMenu",
  component: CardMenu,
  args: {
    menuItems: [
      { label: "Edit", onSelect: fn() },
      { label: "Delete", onSelect: fn() },
      { label: "Archive", onSelect: fn() },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof CardMenu>;

export const Default: Story = {};

export const Outlined: Story = {
  args: {
    outlined: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithIcons: Story = {
  args: {
    showMenuIcon: true,
    menuItems: [
      { label: "Edit", onSelect: fn(), Icon: <Pencil size={16} /> },
      { label: "Delete", onSelect: fn(), Icon: <Trash2 size={16} /> },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    menuItems: [
      { label: "Edit", onSelect: fn() },
      { label: "Delete", onSelect: fn(), disabled: true },
    ],
  },
};

export const WithLoadingItem: Story = {
  args: {
    menuItems: [
      { label: "Edit", onSelect: fn() },
      { label: "Processing...", onSelect: fn(), loading: true, withLoading: true },
    ],
  },
};
