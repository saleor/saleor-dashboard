import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { STORYBOOK_CHROMATIC_PARAMS } from "../../storybook/chromatic";
import { MODEL_TYPE_ICON_COLOR_NAMES } from "./constants";
import { FALLBACK_MODEL_TYPE_ICON } from "./getModelTypeIcon";
import { ModelTypeIcon } from "./ModelTypeIcon";

const meta: Meta<typeof ModelTypeIcon> = {
  title: "Components/ModelTypeIcon",
  component: ModelTypeIcon,
  parameters: STORYBOOK_CHROMATIC_PARAMS,
};

export default meta;

type Story = StoryObj<typeof ModelTypeIcon>;

export const Configured: Story = {
  args: { icon: { name: "book-open", color: "blue" } },
};

/** What every model type without an icon renders. */
export const Fallback: Story = {
  args: { icon: FALLBACK_MODEL_TYPE_ICON },
};

/** An icon name that no longer exists in Lucide degrades to the fallback glyph. */
export const UnknownIconName: Story = {
  args: { icon: { name: "not-a-real-icon", color: "red" } },
};

export const AllColors: StoryObj = {
  render: () => (
    <Box display="flex" gap={4} alignItems="center">
      {MODEL_TYPE_ICON_COLOR_NAMES.map(color => (
        <Box key={color} display="flex" flexDirection="column" alignItems="center" gap={1}>
          <ModelTypeIcon icon={{ name: "book-open", color }} size={24} />
          <Text size={1} color="default2">
            {color}
          </Text>
        </Box>
      ))}
    </Box>
  ),
};

export const Sizes: StoryObj = {
  render: () => (
    <Box display="flex" gap={4} alignItems="center">
      {[14, 16, 20, 24, 32].map(size => (
        <ModelTypeIcon key={size} icon={{ name: "book-open", color: "green" }} size={size} />
      ))}
    </Box>
  ),
};
