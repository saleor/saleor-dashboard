import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { WavePattern } from "./WavePattern";

const meta: Meta<typeof WavePattern> = {
  title: "Auth / WavePattern",
  component: WavePattern,
  decorators: [
    (Story: StoryFn) => (
      <Box
        position="relative"
        __height="320px"
        width="100%"
        backgroundColor="default2"
        __color="oklch(0.42 0.06 268 / 0.14)"
      >
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WavePattern>;

export const Default: Story = {};
