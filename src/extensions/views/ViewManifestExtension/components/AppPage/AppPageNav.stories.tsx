import type { Meta, StoryObj } from "@storybook/react-vite";

import { AppPageNav } from "./AppPageNav";

const squareLogo = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="#111"/><path d="M7 21 17 8h7L14 21z" fill="#fff"/></svg>`,
)}`;

const meta: Meta<typeof AppPageNav> = {
  title: "Extensions/AppPageNav",
  component: AppPageNav,
  args: {
    name: "Pulse",
    author: "Saleor Pulse",
    appId: "app-id",
    appLogoUrl: squareLogo,
    goBackUrl: "/extensions/installed",
    showMangeAppButton: true,
    supportUrl: "https://example.com/support",
    homepageUrl: "https://example.com",
  },
};

export default meta;

type Story = StoryObj<typeof AppPageNav>;

export const Default: Story = {};

export const WithoutAuthor: Story = {
  args: {
    author: null,
  },
};
