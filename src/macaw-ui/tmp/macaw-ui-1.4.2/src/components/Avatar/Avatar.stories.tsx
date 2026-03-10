import { Meta, StoryObj } from "@storybook/react";
import testLogo from "./testLogo.webp";
import { Avatar } from "./index";

const User = Avatar.User;
const Store = Avatar.Store;

const meta: Meta<typeof User> = {
  title: "Components / Avatar",
  tags: ["autodocs"],
  component: User,
  argTypes: {
    scheme: {
      control: "select",
      options: ["accent1", "transparent"],
      defaultValue: "accent1",
    },
  },
};

export default meta;
type Story = StoryObj<typeof User>;

export const Primary: Story = {
  name: "With initials",
  args: {
    initials: "LI",
    scheme: "accent1",
    size: "medium",
  },
};

export const WithImage: Story = {
  args: {
    src: testLogo,
    scheme: "accent1",
    size: "medium",
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const AsStoreInitials: Story = {
  args: {
    initials: "LI",
    scheme: "accent1",
    size: "medium",
  },
  render: (args) => <Store {...args} />,
};

export const AsStoreImage: Story = {
  args: {
    src: testLogo,
    scheme: "accent1",
    size: "medium",
  },
  render: (args) => <Store {...args} />,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
