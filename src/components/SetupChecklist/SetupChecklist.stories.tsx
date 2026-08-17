import { Box, Button, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, CreditCard, Package, Receipt, Truck, Warehouse } from "lucide-react";
import { fn } from "storybook/test";

import { SetupChecklist, SetupChecklistBadge } from "./SetupChecklist";
import { type SetupChecklistTask } from "./types";

const meta: Meta<typeof SetupChecklist> = {
  title: "Components / SetupChecklist",
  component: SetupChecklist,
};

export default meta;
type Story = StoryObj<typeof SetupChecklist>;

const ActionButton = ({
  children,
  variant = "secondary",
  disabled = false,
}: {
  children: string;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
}) => (
  <Button variant={variant} disabled={disabled} onClick={fn()}>
    <Box display="flex" alignItems="center" gap={1}>
      {children}
      <ArrowRight size={14} />
    </Box>
  </Button>
);

const requiredTasks: SetupChecklistTask[] = [
  {
    id: "warehouse",
    title: "Add a stock location",
    description:
      "Create a warehouse, or assign an existing one, so this channel can allocate inventory.",
    status: "active",
    details:
      "Inventory is tracked per warehouse. This channel can only reserve stock from warehouses you assign here—without one, checkout can’t allocate inventory for tracked products.",
    detailsIcon: <Warehouse size={16} />,
    action: <ActionButton variant="primary">Create warehouse</ActionButton>,
  },
  {
    id: "shipping",
    title: "Set up shipping",
    description:
      "Create a shipping zone for your default country with a flat rate, or assign an existing zone.",
    status: "locked",
    requirement: "Requires a stock location",
    details:
      "Shipping zones define which countries you deliver to and which rates customers see at checkout. Assign this channel to a zone that covers your market so shoppers can choose a shipping method.",
    detailsIcon: <Truck size={16} />,
    action: <ActionButton disabled>Create shipping zone</ActionButton>,
  },
];

const reviewSection = {
  title: "Worth reviewing",
  subtitle: "Review before activating",
  items: [
    {
      id: "tax",
      icon: <Receipt size={16} />,
      title: "Taxes",
      description: "How tax is calculated for this channel.",
      status: "Flat rates",
      onClick: fn(),
    },
    {
      id: "payments",
      icon: <CreditCard size={16} />,
      title: "Payments",
      description: "Payment apps customers can pay with at checkout.",
      status: "No payment apps",
      onClick: fn(),
    },
    {
      id: "catalog",
      icon: <Package size={16} />,
      title: "Products",
      description: "Products published to this channel, priced in its currency.",
      status: "0 of 128 published",
      onClick: fn(),
    },
  ],
};

export const ChannelRequiredSteps: Story = {
  args: {
    title: "Finish setting up this market",
    badge: <SetupChecklistBadge>Draft</SetupChecklistBadge>,
    subtitle:
      "Customers can’t check out until the required steps are done. Finish them now or come back later.",
    progress: { done: 0, total: 2 },
    tasksSection: { title: "Required by checkout" },
    tasks: requiredTasks,
    reviewSection,
    nextUp: (
      <>
        Next up:{" "}
        <Text as="span" size={2} fontWeight="medium" color="default1">
          Add a stock location
        </Text>
      </>
    ),
    footerActions: (
      <>
        <Button variant="tertiary" onClick={fn()}>
          Skip for now
        </Button>
        <Button variant="primary" disabled onClick={fn()}>
          Activate channel
        </Button>
      </>
    ),
  },
};

export const RequiredStepsComplete: Story = {
  args: {
    title: "Finish setting up this market",
    subtitle:
      "Stock and shipping are ready. Optional steps below can still help finish this market.",
    progress: { done: 2, total: 2 },
    tasksSection: { title: "Required by checkout" },
    tasks: [
      {
        ...requiredTasks[0],
        status: "completed",
        description: "1 warehouse assigned",
        action: undefined,
      },
      {
        ...requiredTasks[1],
        status: "completed",
        description: "1 shipping zone assigned",
        requirement: undefined,
        action: undefined,
      },
    ],
    reviewSection: {
      ...reviewSection,
      items: [
        reviewSection.items[0],
        { ...reviewSection.items[1], status: "2 payment apps" },
        { ...reviewSection.items[2], status: "3 of 128 published" },
      ],
    },
    nextUp: "Required steps are complete.",
    footerActions: (
      <>
        <Button variant="tertiary" onClick={fn()}>
          Dismiss
        </Button>
        <Button variant="primary" onClick={fn()}>
          Activate channel
        </Button>
      </>
    ),
  },
};
