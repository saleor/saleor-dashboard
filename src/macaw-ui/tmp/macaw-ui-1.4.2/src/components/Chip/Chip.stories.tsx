import { Meta, StoryObj } from "@storybook/react";

import { Box } from "../Box";
import { Text } from "../Text";
import { Chip } from "./Chip";

const meta: Meta<typeof Chip> = {
  title: "Components / Chip",
  tags: ["autodocs"],
  component: Chip,
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Primary: Story = {
  args: {
    size: "large",
  },
  render: (props) => (
    <Box display="grid" gridTemplateColumns={2} gap={5}>
      {/* Neutral */}
      <Chip {...props} color="default1" backgroundColor="default1">
        <Text size={1} color="default1">
          Example
        </Text>
      </Chip>
      {/* Red */}
      <Chip
        {...props}
        color="critical1"
        backgroundColor="critical1"
        borderColor="critical1"
      >
        <Text color="critical1" size={1}>
          Example
        </Text>
      </Chip>
      {/* Green */}
      <Chip
        {...props}
        color="success1"
        backgroundColor="success1"
        borderColor="success1"
      >
        <Text color="success1" size={1}>
          Example
        </Text>
      </Chip>
      {/* Blue */}
      <Chip {...props} backgroundColor="info1" borderColor="info1">
        <Text color="info1" size={1}>
          Example
        </Text>
      </Chip>
    </Box>
  ),
};
