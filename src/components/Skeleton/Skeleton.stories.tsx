import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "Components/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  decorators: [
    (Story: StoryFn) => (
      <Box backgroundColor="default1" padding={6} __maxWidth="360px">
        <Story />
      </Box>
    ),
  ],
  args: {
    __height: "14px",
    __width: "60%",
  },
};

export const Thumbnail: Story = {
  decorators: [
    (Story: StoryFn) => (
      <Box backgroundColor="default1" padding={6}>
        <Story />
      </Box>
    ),
  ],
  args: {
    __height: "31px",
    __width: "31px",
    borderRadius: 2,
  },
};

export const TableRow: Story = {
  render: () => (
    <Box
      backgroundColor="default1"
      display="flex"
      alignItems="center"
      gap={3}
      padding={2}
      __width="100%"
      __maxWidth="640px"
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
    >
      <Skeleton __width="16px" __height="16px" borderRadius={1} />
      <Skeleton __width="31px" __height="31px" borderRadius={2} flexShrink="0" />
      <Skeleton __height="14px" __width="42%" __minWidth="120px" />
      <Skeleton __height="14px" __width="22%" __minWidth="72px" />
      <Skeleton __height="14px" __width="28%" __minWidth="96px" />
    </Box>
  ),
};
