import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";

import { HomeEmptyState } from "./HomeEmptyState";

const meta: Meta<typeof HomeEmptyState> = {
  title: "Home / HomeEmptyState",
  component: HomeEmptyState,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <div style={{ height: "100vh", background: "var(--mu-colors-background-default1)" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof HomeEmptyState>;

export const Default: Story = {};
