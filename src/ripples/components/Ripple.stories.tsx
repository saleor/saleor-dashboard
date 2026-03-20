import type { Ripple as RippleModel } from "@dashboard/ripples/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { defineMessage } from "react-intl";
import { fn } from "storybook/test";

import { Ripple } from "./Ripple";

const baseRipple: RippleModel = {
  type: "feature",
  ID: "story-ripple",
  dateAdded: new Date(2025, 0, 15),
  TTL_seconds: 999999,
  content: {
    oneLiner: "New feature available",
    global:
      "This is a detailed description of the new feature that appears in the global changelog.",
    contextual: "Click here to learn about this new feature.",
  },
};

const RIPPLE_STORAGE_KEY = "dashboard-ripples";

const meta: Meta<typeof Ripple> = {
  title: "Ripples/Ripple",
  component: Ripple,
  beforeEach: () => {
    localStorage.removeItem(RIPPLE_STORAGE_KEY);
  },
};

export default meta;

type Story = StoryObj<typeof Ripple>;

export const Default: Story = {
  args: {
    model: baseRipple,
  },
};

export const WithHrefAction: Story = {
  args: {
    model: {
      ...baseRipple,
      ID: "story-ripple-href",
      content: {
        ...baseRipple.content,
        contextual: "You can now generate product variants automatically.",
      },
      actions: [
        {
          label: defineMessage({
            defaultMessage: "Learn more",
            id: "TdTXXf",
          }),
          href: "https://docs.saleor.io",
        },
      ],
    },
  },
};

export const WithOnClickAction: Story = {
  args: {
    model: {
      ...baseRipple,
      ID: "story-ripple-onclick",
      content: {
        ...baseRipple.content,
        contextual: "Check out the improvements to order management.",
      },
      actions: [
        {
          label: defineMessage({
            defaultMessage: "Show me",
            id: "3eR8iC",
          }),
          onClick: fn(),
        },
      ],
    },
  },
};
