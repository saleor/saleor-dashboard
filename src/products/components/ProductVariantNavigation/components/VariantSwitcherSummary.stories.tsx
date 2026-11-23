import placeholderImage from "@assets/images/placeholder60x60.png";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { VariantSwitcherSummary } from "./VariantSwitcherSummary";

const meta: Meta<typeof VariantSwitcherSummary> = {
  title: "Products/ProductVariantNavigation/VariantSwitcherSummary",
  component: VariantSwitcherSummary,
  decorators: [
    (Story: StoryFn) => (
      <Box
        __maxWidth="358px"
        borderWidth={1}
        borderStyle="solid"
        borderColor="default1"
        borderRadius={4}
      >
        <Story />
      </Box>
    ),
  ],
  args: {
    name: "M / Forest green",
    thumbnailUrl: placeholderImage,
    isDefault: false,
    isPending: false,
    position: 13,
    totalCount: 64,
    expanded: false,
    panelId: "variant-list",
    onToggle: fn(),
    onPrevious: fn(),
    onNext: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VariantSwitcherSummary>;

export const Default: Story = {};

export const ListOpen: Story = { args: { expanded: true } };

/** The first variant has nothing before it; the default variant says so. */
export const FirstAndDefault: Story = {
  args: { name: "XS / Black", position: 1, isDefault: true, onPrevious: undefined },
};

export const WithoutImage: Story = { args: { thumbnailUrl: undefined } };

/** A long name wraps to two lines before it is cut. */
export const LongName: Story = {
  args: { name: "Extra large / Heather grey / Organic cotton / Long sleeve / Relaxed fit" },
};

/** Selected, with its details still loading. */
export const Pending: Story = { args: { isPending: true } };

/** The open variant is beyond the loaded part of the list: no place, no neighbours. */
export const PlaceUnknown: Story = {
  args: { position: null, onPrevious: undefined, onNext: undefined },
};

/** Nothing is known yet. */
export const Loading: Story = {
  args: {
    name: undefined,
    thumbnailUrl: undefined,
    position: null,
    totalCount: null,
    onPrevious: undefined,
    onNext: undefined,
  },
};

/** A variant being created has no place among the others yet, so nothing to step to. */
export const NewVariant: Story = {
  args: {
    name: "New variant",
    thumbnailUrl: undefined,
    position: null,
    onPrevious: undefined,
    onNext: undefined,
    hideSteps: true,
  },
};
