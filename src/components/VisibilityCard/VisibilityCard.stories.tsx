import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import VisibilityCard from "./VisibilityCard";

const messages = {
  visibleLabel: "Visible",
  hiddenLabel: "Hidden",
  hiddenSecondLabel: "will be visible from a scheduled date",
  visibleSecondLabel: "since",
  availableLabel: "Available for purchase",
  unavailableLabel: "Unavailable for purchase",
  availableSecondLabel: "will become available on a scheduled date",
  setAvailabilityDateLabel: "Set availability date",
};

const meta: Meta<typeof VisibilityCard> = {
  title: "Components / VisibilityCard",
  component: VisibilityCard,
  args: {
    errors: [],
    messages,
    onChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VisibilityCard>;

export const Visible: Story = {
  args: {
    data: {
      isPublished: true,
      publishedAt: null,
    },
  },
};

export const Hidden: Story = {
  args: {
    data: {
      isPublished: false,
      publishedAt: null,
    },
  },
};

// A page stored with `isPublished: true` and a future `publishedAt` is not yet
// visible to storefront visitors, so the card presents it under "Hidden" with
// the scheduled date controls revealed.
export const ScheduledForFuturePublication: Story = {
  args: {
    data: {
      isPublished: true,
      publishedAt: "2099-01-01T00:00:00Z",
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    data: {
      isPublished: true,
      publishedAt: null,
    },
  },
};

// Product-style usage: the availability-for-purchase section appears when both
// `isAvailableForPurchase` and `availableForPurchaseAt` are provided.
export const WithAvailableForPurchase: Story = {
  args: {
    data: {
      isPublished: true,
      publishedAt: null,
      isAvailableForPurchase: false,
      availableForPurchaseAt: null,
    },
  },
};

// Product-style usage with the listings visibility checkbox.
export const WithVisibleInListings: Story = {
  args: {
    data: {
      isPublished: true,
      publishedAt: null,
      isAvailableForPurchase: true,
      availableForPurchaseAt: null,
      visibleInListings: true,
    },
  },
};
