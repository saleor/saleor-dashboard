import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentType } from "react";

import { TimezoneProvider } from "../Timezone";
import { TimelineNote } from "./TimelineNote";
import { type Actor } from "./types";

const userActor: Actor = {
  type: "user",
  id: "user-1",
  email: "admin@example.com",
  firstName: "John",
  lastName: "Doe",
};

const appActor: Actor = {
  type: "app",
  id: "app-1",
  name: "Fulfillment App",
};

const meta: Meta<typeof TimelineNote> = {
  title: "Components/Timeline/TimelineNote",
  component: TimelineNote,
  decorators: [
    (Story: ComponentType) => (
      <TimezoneProvider value="UTC">
        <div style={{ maxWidth: 600 }}>
          <Story />
        </div>
      </TimezoneProvider>
    ),
  ],
  args: {
    date: "2026-03-16T10:30:00Z",
    message: "Order has been fulfilled and shipped to the customer.",
    actor: userActor,
  },
};

export default meta;
type Story = StoryObj<typeof TimelineNote>;

export const Default: Story = {};

export const WithPlainDate: Story = {
  args: {
    hasPlainDate: true,
  },
};

export const AppActor: Story = {
  args: {
    actor: appActor,
  },
};

export const Editable: Story = {
  args: {
    id: "note-1",
    onNoteUpdate: async () => {},
    onNoteUpdateLoading: false,
  },
};

export const EditedNote: Story = {
  args: {
    id: "note-2",
    relatedId: "note-1",
    message: "Updated: Order shipped via express delivery.",
  },
};

export const WithEventData: Story = {
  args: {
    eventData: {
      type: "ORDER_FULFILLED",
      trackingNumber: "1Z999AA10123456784",
      carrier: "UPS",
    },
  },
};

export const LongMessage: Story = {
  args: {
    message:
      "This is a very long note that contains multiple paragraphs of text.\n\nThe customer requested special packaging for this order. We have confirmed with the warehouse team that all items will be wrapped individually.\n\nPlease ensure the delivery is scheduled for a weekday between 9 AM and 5 PM.",
  },
};

export const LastInGroup: Story = {
  args: {
    isLastInGroup: true,
  },
};
