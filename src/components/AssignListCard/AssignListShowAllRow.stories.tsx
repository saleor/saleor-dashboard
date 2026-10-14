import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { type ReactElement } from "react";
import { fn } from "storybook/test";

import { AssignListShowAllRow } from "./AssignListShowAllRow";

const meta: Meta<typeof AssignListShowAllRow> = {
  title: "Components / AssignListShowAllRow",
  component: AssignListShowAllRow,
  decorators: [
    (Story: StoryFn): ReactElement => (
      <Box __maxWidth="420px" padding={4}>
        <Story />
      </Box>
    ),
  ],
  args: {
    label: "Show all 115 shipping zones",
    onClick: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof AssignListShowAllRow>;

export const Default: Story = {};
