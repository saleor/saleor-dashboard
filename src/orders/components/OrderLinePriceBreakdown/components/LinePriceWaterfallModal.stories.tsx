import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import {
  discountedWaterfall,
  overriddenNoDiscountWaterfall,
  overriddenNoReasonWaterfall,
  overriddenWithDiscountWaterfall,
} from "../fixtures";
import { LinePriceWaterfallModal } from "./LinePriceWaterfallModal";

const meta: Meta<typeof LinePriceWaterfallModal> = {
  title: "Orders/LinePriceWaterfallModal",
  component: LinePriceWaterfallModal,
  args: {
    onClose: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof LinePriceWaterfallModal>;

/** Plain discounted line — no override. */
export const Discounted: Story = {
  args: {
    waterfall: discountedWaterfall,
  },
};

/** Price overridden with a reason, no discounts: base row equals final total,
 *  the "Overridden" badge and reason explain the custom price. */
export const OverriddenWithReason: Story = {
  args: {
    waterfall: overriddenNoDiscountWaterfall,
  },
};

/** Price overridden AND discounted: badge + reason on the base row, plus the
 *  usual discount steps below. */
export const OverriddenAndDiscounted: Story = {
  args: {
    waterfall: overriddenWithDiscountWaterfall,
  },
};

/** Overridden without a recorded reason: badge shows, detail falls back to the
 *  generic explainer. */
export const OverriddenWithoutReason: Story = {
  args: {
    waterfall: overriddenNoReasonWaterfall,
  },
};
