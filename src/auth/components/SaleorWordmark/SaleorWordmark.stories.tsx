import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { SaleorWordmark } from "./SaleorWordmark";

const meta: Meta<typeof SaleorWordmark> = {
  title: "Auth / SaleorWordmark",
  component: SaleorWordmark,
  decorators: [
    (Story: StoryFn) => (
      <Box padding={6}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SaleorWordmark>;

export const Default: Story = {};
