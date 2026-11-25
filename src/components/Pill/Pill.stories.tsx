import { type PillStatusType } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Banknote } from "lucide-react";
import { type ComponentProps } from "react";

import { Pill } from "./Pill";

const STATUSES: PillStatusType[] = ["success", "info", "warning", "attention", "error", "neutral"];

const meta: Meta<typeof Pill> = {
  title: "Components/Pill",
  component: Pill,
  args: {
    label: "Partially fulfilled",
    color: "info",
  },
};

export default meta;
type Story = StoryObj<typeof Pill>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "small",
    label: "Success",
    color: "success",
  },
};

export const WithIcon: Story = {
  args: {
    label: "Fully charged",
    color: "success",
    icon: <Banknote size={16} />,
  },
};

export const AllStatuses: Story = {
  render: (args: ComponentProps<typeof Pill>) => (
    <Box display="flex" flexDirection="column" gap={3}>
      {(["medium", "small"] as const).map(size => (
        <Box key={size} display="flex" gap={2} flexWrap="wrap">
          {STATUSES.map(status => (
            <Pill {...args} key={status} size={size} color={status} label={status} />
          ))}
        </Box>
      ))}
    </Box>
  ),
};
