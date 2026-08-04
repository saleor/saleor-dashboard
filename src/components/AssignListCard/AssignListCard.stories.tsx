import type { Meta, StoryObj } from "@storybook/react-vite";
import { Truck } from "lucide-react";

import { AssignListCard } from "./AssignListCard";

const meta: Meta<typeof AssignListCard> = {
  title: "Components / AssignListCard",
  component: AssignListCard,
};

export default meta;
type Story = StoryObj<typeof AssignListCard>;

export const WithItems: Story = {
  args: {
    title: "Delivery",
    subtitle: "2 assigned",
    intro: "Shipping zones supplied through this channel.",
    items: [
      { id: "1", name: "EU Standard", href: "/shipping/zones/1" },
      { id: "2", name: "Iberia Express", href: "/shipping/zones/2" },
    ],
    emptyState: {
      icon: <Truck size={16} />,
      title: "No shipping zones assigned",
      description: "Customers won't see any delivery method at checkout.",
    },
    onRemoveItem: () => undefined,
    "data-test-id": "assign-list-card",
  },
};

export const Empty: Story = {
  args: {
    ...WithItems.args,
    items: [],
    subtitle: "Required to sell",
  },
};
