import { Box, Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType } from "react";
import { fn } from "storybook/test";

import { CardTitle } from "./CardTitle";

const meta: Meta<typeof CardTitle> = {
  title: "Components/CardTitle",
  component: CardTitle,
  decorators: [
    (Story: ComponentType) => (
      <Box backgroundColor="default1" __maxWidth={640}>
        <Story />
      </Box>
    ),
  ],
  args: {
    title: "Section title",
  },
};

export default meta;
type Story = StoryObj<typeof CardTitle>;

export const Default: Story = {};

export const WithSubtitle: Story = {
  args: {
    subtitle: "Additional description for this section",
  },
};

export const WithToolbar: Story = {
  args: {
    toolbar: (
      <Button variant="secondary" onClick={fn()}>
        Action
      </Button>
    ),
  },
};

export const WithSubtitleAndToolbar: Story = {
  args: {
    subtitle: "Additional description",
    toolbar: (
      <Button variant="secondary" onClick={fn()}>
        Action
      </Button>
    ),
  },
};

export const CustomBackground: Story = {
  args: {
    backgroundColor: "default2",
    subtitle: "Card title with alternative background colour",
  },
};
