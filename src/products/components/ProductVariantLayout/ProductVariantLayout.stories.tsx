import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ProductVariantLayout } from "./ProductVariantLayout";

const Placeholder = ({ label, height }: { label: string; height: string }) => (
  <Box
    __height={height}
    padding={6}
    backgroundColor="default2"
    borderWidth={1}
    borderStyle="solid"
    borderColor="default1"
  >
    <Text>{label}</Text>
  </Box>
);

const meta: Meta<typeof ProductVariantLayout> = {
  title: "Products/ProductVariantLayout",
  component: ProductVariantLayout,
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ProductVariantLayout>;

/**
 * Follows the viewport: from 1280px the variants sit beside the form, below that they stack
 * above it. Resize the preview to see both.
 */
export const Default: Story = {
  args: {
    navigation: <Placeholder label="Variants" height="120px" />,
    children: <Placeholder label="Variant form" height="600px" />,
  },
};
