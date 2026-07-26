import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { AppReloadDialog } from "./AppReloadDialog";

const currentManifest = JSON.stringify({
  id: "saleor.app.example",
  name: "Example App",
  permissions: ["MANAGE_ORDERS"],
  webhooks: [{ name: "order-created", targetUrl: "https://app.example/api/webhook" }],
});
const incomingManifest = JSON.stringify({
  id: "saleor.app.example",
  name: "Example App",
  permissions: ["MANAGE_ORDERS", "MANAGE_PRODUCTS"],
  webhooks: [{ name: "order-created", targetUrl: "https://app.example/api/webhooks/orders" }],
});

const meta: Meta<typeof AppReloadDialog> = {
  title: "Extensions/AppReloadDialog",
  component: AppReloadDialog,
  args: {
    confirmButtonState: "default",
    open: true,
    name: "Example App",
    previewLoading: false,
    previewError: null,
    preview: null,
    onClose: fn(),
    onConfirm: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AppReloadDialog>;

export const Loading: Story = {
  args: { previewLoading: true },
};

export const FetchError: Story = {
  args: { previewError: "Unable to fetch manifest data." },
};

export const UpToDate: Story = {
  args: {
    preview: { currentManifest, incomingManifest: currentManifest },
  },
};

export const WithChanges: Story = {
  args: {
    preview: { currentManifest, incomingManifest },
  },
};
