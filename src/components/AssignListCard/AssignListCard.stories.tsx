import { Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryFn, StoryObj } from "@storybook/react-vite";
import { Truck, User } from "lucide-react";

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

export const WithItemIcons: Story = {
  args: {
    ...WithItems.args,
    title: "Assigned customer",
    subtitle: "Restricted",
    intro: "Only this customer can redeem the gift card.",
    items: [{ id: "1", name: "Jane Customer", href: "/customers/1", icon: <User size={16} /> }],
    emptyState: {
      icon: <User size={16} />,
      title: "No customer assigned",
      description: "Anyone with the code can redeem it.",
    },
  },
};

export const Empty: Story = {
  args: {
    ...WithItems.args,
    items: [],
    subtitle: "Required to sell",
    footerAction: (
      <Button variant="secondary" type="button">
        Assign shipping zone
      </Button>
    ),
  },
};

/** Sidebar-width card — empty action stacks under icon+copy, right-aligned. */
export const EmptyNarrow: Story = {
  args: {
    ...Empty.args,
    title: "Assigned customer",
    subtitle: "Unrestricted",
    intro: "Only this customer can redeem the gift card.",
    emptyState: {
      icon: <User size={16} />,
      title: "No customer assigned",
      description: "This card is unrestricted — anyone with the code can redeem it.",
    },
    footerAction: (
      <Button variant="secondary" type="button">
        Assign customer
      </Button>
    ),
  },
  decorators: [
    (Story: StoryFn): JSX.Element => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};
