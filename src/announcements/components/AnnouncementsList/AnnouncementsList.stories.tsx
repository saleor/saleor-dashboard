import {
  announcementFixtures,
  announcementGroupedFixtures,
} from "@dashboard/announcements/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AnnouncementsList } from "./AnnouncementsList";

const meta: Meta<typeof AnnouncementsList> = {
  title: "Announcements/AnnouncementsList",
  component: AnnouncementsList,
};

export default meta;

type Story = StoryObj<typeof AnnouncementsList>;

export const Default: Story = {
  args: {
    announcements: announcementFixtures,
  },
};

export const Grouped: Story = {
  args: {
    announcements: announcementGroupedFixtures,
  },
};

export const Empty: Story = {
  args: {
    announcements: [],
  },
};
