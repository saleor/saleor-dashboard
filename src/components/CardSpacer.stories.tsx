import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";

import CardSpacer from "./CardSpacer";

const Block = ({ label }: { label: string }): JSX.Element => (
  <Box borderStyle="solid" borderWidth={1} borderColor="default1" padding={4}>
    <Text>{label}</Text>
  </Box>
);

const meta: Meta<typeof CardSpacer> = {
  title: "Components/CardSpacer",
  component: CardSpacer,
  render: (args: ComponentProps<typeof CardSpacer>) => (
    <Box padding={4}>
      <Block label="Card above" />
      <CardSpacer {...args} />
      <Block label="Card below" />
    </Box>
  ),
};

export default meta;
type Story = StoryObj<typeof CardSpacer>;

/** 3.2rem gap; 1.6rem below 1280px viewport width. */
export const Default: Story = {};

export const WithBackground: Story = {
  args: {
    backgroundColor: "default2",
    children: <Text>Spacer content</Text>,
  },
};
