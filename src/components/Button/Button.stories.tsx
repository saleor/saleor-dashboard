import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  args: {
    children: "Click me",
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    variant: "tertiary",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AsInternalLink: Story = {
  args: {
    href: "/products/",
    children: "Go to products",
  },
};

export const AsExternalLink: Story = {
  args: {
    href: "https://saleor.io",
    children: "Visit Saleor",
  },
};
