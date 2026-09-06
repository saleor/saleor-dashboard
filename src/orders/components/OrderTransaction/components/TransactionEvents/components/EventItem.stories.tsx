import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody } from "@dashboard/components/Table/Table";
import { transactions } from "@dashboard/orders/fixtures";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { EventItem } from "./EventItem";

const chargeEvent = transactions.chargeSuccess[0].events[0];
const failedEvent = transactions.chargeFail[0].events[0];

const meta: Meta<typeof EventItem> = {
  title: "Orders/OrderTransaction/EventItem",
  component: EventItem,
  render: (args: ComponentProps<typeof EventItem>) => (
    <ResponsiveTable>
      <TableBody>
        <EventItem {...args} />
      </TableBody>
    </ResponsiveTable>
  ),
  args: {
    event: chargeEvent,
    hoveredPspReference: null,
    onHover: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EventItem>;

export const Default: Story = {};

export const Failed: Story = {
  args: { event: failedEvent },
};

/** Hovering a PSP reference highlights every event sharing it. */
export const LinkedHighlight: Story = {
  args: { hoveredPspReference: chargeEvent.pspReference },
};

export const WithExternalUrl: Story = {
  args: {
    event: { ...chargeEvent, externalUrl: "https://example.com/payments/1" },
  },
};

/** The first column's 48px inset is only visible next to a sibling row. */
export const AmongOtherEvents: Story = {
  render: (args: ComponentProps<typeof EventItem>) => (
    <ResponsiveTable>
      <TableBody>
        <EventItem {...args} />
        <EventItem {...args} event={failedEvent} />
      </TableBody>
    </ResponsiveTable>
  ),
};
