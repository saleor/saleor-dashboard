import { Text } from "@saleor/macaw-ui-next";
import { type Meta, type StoryObj } from "@storybook/react-vite";

import { TimelineLink } from "./TimelineLink";

const meta: Meta<typeof TimelineLink> = {
  title: "Components/Timeline/TimelineLink",
  component: TimelineLink,
};

export default meta;

type Story = StoryObj<typeof TimelineLink>;

export const InSentence: Story = {
  render: () => (
    <Text size={3} color="default1">
      Card was bought in order{" "}
      <TimelineLink href="/orders/T3JkZXI6Mjc2" entity="order">
        #276
      </TimelineLink>{" "}
      by{" "}
      <TimelineLink href="/staff/1" entity="staff">
        John Appleseed
      </TimelineLink>{" "}
      for{" "}
      <TimelineLink href="/customers/1" entity="customer">
        deborah.lee@example.com
      </TimelineLink>
    </Text>
  ),
};
