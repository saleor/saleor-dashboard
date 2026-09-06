import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import ProductMediaPage from "./ProductMediaPage";

const media = [
  { id: "media-1", url: "https://placehold.co/400x400?text=1" },
  { id: "media-2", url: "https://placehold.co/400x400?text=2" },
  { id: "media-3", url: "https://placehold.co/400x400?text=3" },
];

const meta: Meta<typeof ProductMediaPage> = {
  title: "Products/ProductMediaPage",
  component: ProductMediaPage,
  parameters: { layout: "fullscreen" },
  argTypes: {
    saveButtonBarState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
  },
  args: {
    productId: "product-1",
    product: "Apple Juice",
    media,
    mediaObj: {
      id: "media-1",
      alt: "Bottle of apple juice on a white background",
      url: "https://placehold.co/400x400?text=1",
      type: "IMAGE",
    },
    disabled: false,
    saveButtonBarState: "default",
    onDelete: fn(),
    onRowClick: fn(() => fn()),
    onShowMetadata: fn(),
    onSubmit: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof ProductMediaPage>;

export const Default: Story = {};

export const WithoutDescription: Story = {
  args: { mediaObj: { id: "media-1", alt: "", url: media[0].url, type: "IMAGE" } },
};

export const Loading: Story = { args: { mediaObj: undefined, media: undefined } };

export const Saving: Story = { args: { saveButtonBarState: "loading" } };

export const Disabled: Story = { args: { disabled: true } };
