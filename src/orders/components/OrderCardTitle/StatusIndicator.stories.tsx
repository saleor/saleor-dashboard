import { FulfillmentStatus } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { StatusIndicator } from "./StatusIndicator";

const meta: Meta<typeof StatusIndicator> = {
  title: "Orders/OrderCardTitle/StatusIndicator",
  component: StatusIndicator,
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Refunded: Story = {
  args: { status: FulfillmentStatus.REFUNDED },
};

export const Returned: Story = {
  args: { status: FulfillmentStatus.RETURNED },
};

export const RefundedAndReturned: Story = {
  args: { status: FulfillmentStatus.REFUNDED_AND_RETURNED },
};

export const Fulfilled: Story = {
  args: { status: FulfillmentStatus.FULFILLED },
};

export const Replaced: Story = {
  args: { status: FulfillmentStatus.REPLACED },
};

export const Canceled: Story = {
  args: { status: FulfillmentStatus.CANCELED },
};

export const WaitingForApproval: Story = {
  args: { status: FulfillmentStatus.WAITING_FOR_APPROVAL },
};

const allStatuses: Array<{ label: string; status: FulfillmentStatus }> = [
  { label: "Refunded", status: FulfillmentStatus.REFUNDED },
  { label: "Returned", status: FulfillmentStatus.RETURNED },
  { label: "Refunded & Returned", status: FulfillmentStatus.REFUNDED_AND_RETURNED },
  { label: "Fulfilled", status: FulfillmentStatus.FULFILLED },
  { label: "Replaced", status: FulfillmentStatus.REPLACED },
  { label: "Canceled", status: FulfillmentStatus.CANCELED },
  { label: "Waiting for approval", status: FulfillmentStatus.WAITING_FOR_APPROVAL },
];

export const AllStatuses: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap={3}>
      {allStatuses.map(({ label, status }) => (
        <Box key={status} display="flex" alignItems="center" gap={3}>
          <StatusIndicator status={status} />
          <Text size={2}>{label}</Text>
        </Box>
      ))}
    </Box>
  ),
};
