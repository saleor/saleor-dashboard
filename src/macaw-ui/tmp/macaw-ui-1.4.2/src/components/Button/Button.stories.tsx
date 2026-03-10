import { Meta, StoryObj } from "@storybook/react";
import { RemoveIcon, SearchIcon } from "../Icons";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components / Button",
  tags: ["autodocs"],
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: "Example",
  },
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    ...Primary.args,
    variant: "tertiary",
  },
};

export const Error: Story = {
  args: {
    ...Primary.args,
    variant: "error",
  },
};

export const PrimaryIcon: Story = {
  args: {
    variant: "primary",
    size: "large",
    icon: <RemoveIcon />,
  },
};

export const SecondaryIcon: Story = {
  args: {
    ...PrimaryIcon.args,
    variant: "secondary",
  },
};

export const TertiaryIcon: Story = {
  args: {
    ...PrimaryIcon.args,
    variant: "tertiary",
  },
};

export const ErrorIcon: Story = {
  args: {
    ...PrimaryIcon.args,
    variant: "error",
  },
};

export const PrimaryTextIcon: Story = {
  args: {
    variant: "primary",
    size: "large",
    children: [
      <SearchIcon size="small" />, // eslint-disable-line react/jsx-key
      "Search",
    ],
  },
};

export const SecondaryTextIcon: Story = {
  args: {
    ...PrimaryTextIcon.args,
    variant: "secondary",
  },
};

export const TertiaryTextIcon: Story = {
  args: {
    ...PrimaryTextIcon.args,
    variant: "tertiary",
  },
};

export const ErrorTextIcon: Story = {
  args: {
    ...PrimaryTextIcon.args,
    variant: "error",
  },
};
