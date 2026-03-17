import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { MediaWithFallback } from "./MediaWithFallback";

const meta: Meta<typeof MediaWithFallback> = {
  title: "Components/MediaWithFallback",
  component: MediaWithFallback,
  decorators: [
    (Story: ComponentType) => (
      <div style={{ width: 200, height: 200 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MediaWithFallback>;

export const Default: Story = {
  args: {
    src: "https://placehold.co/200x200",
    alt: "Placeholder image",
  },
};

export const WithBrokenImage: Story = {
  args: {
    src: "https://invalid-url-that-will-fail.com/image.png",
    alt: "Broken image",
  },
};

export const WithEmptySrc: Story = {
  args: {
    src: "",
    alt: "Empty source",
  },
};

export const WithCustomClassName: Story = {
  args: {
    src: "https://placehold.co/200x200",
    alt: "Styled image",
    className: "custom-class",
    style: { borderRadius: 8, objectFit: "cover" },
  },
};

export const WithHtmlImageProps: Story = {
  args: {
    src: "https://placehold.co/200x200",
    alt: "Image with extra HTML props",
    width: 150,
    height: 150,
    loading: "lazy",
    decoding: "async",
  },
};
