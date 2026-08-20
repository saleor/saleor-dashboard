import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { type OfferSavingsPreviewData, OfferSavingsPreviewView } from "./OfferSavingsPreview";

const preview: OfferSavingsPreviewData = {
  __typename: "OfferSavingsPreview",
  offerCount: 1,
  channelCount: 1,
  offers: [
    {
      __typename: "OfferPreviewItem",
      productId: "UHJvZHVjdDox",
      productName: "Senior Backend Engineer - Berlin",
      channelSlug: "germany-jobs-marketplace",
      originalPrice: { __typename: "Money", amount: 999, currency: "EUR" },
      promotionalPrice: { __typename: "Money", amount: 799.2, currency: "EUR" },
      savingsAmount: { __typename: "Money", amount: 199.8, currency: "EUR" },
    },
  ],
  warnings: [],
};

const meta: Meta<typeof OfferSavingsPreviewView> = {
  title: "Discounts/OfferSavingsPreview",
  component: OfferSavingsPreviewView,
  args: {
    called: true,
    loading: false,
    error: false,
    preview,
    promotionId: "UHJvbW90aW9uOjE=",
    onPreview: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof OfferSavingsPreviewView>;

export const Populated: Story = {};

export const Initial: Story = {
  args: { called: false, preview: undefined },
};

export const Loading: Story = {
  args: { loading: true, preview: undefined },
};

export const Empty: Story = {
  args: {
    preview: { ...preview, offerCount: 0, channelCount: 0, offers: [] },
  },
};

export const Error: Story = {
  args: { error: true, preview: undefined },
};
