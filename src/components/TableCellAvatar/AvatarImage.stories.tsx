import type { Meta, StoryObj } from "@storybook/react-vite";

import AvatarImage from "./AvatarImage";

const meta: Meta<typeof AvatarImage> = {
  title: "Components/AvatarImage",
  component: AvatarImage,
};

export default meta;
type Story = StoryObj<typeof AvatarImage>;

export const WithThumbnail: Story = {
  args: {
    thumbnail: "https://via.placeholder.com/40",
  },
};

export const WithInitials: Story = {
  args: {
    initials: "AB",
  },
};

export const EmptyPlaceholder: Story = {};
