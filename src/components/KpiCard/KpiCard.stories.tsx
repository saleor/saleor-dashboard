import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShoppingCart, TrendingUp, UserPlus } from "lucide-react";
import { fn } from "storybook/test";

import { KpiCard } from "./KpiCard";

const meta: Meta<typeof KpiCard> = {
  title: "Components / KpiCard",
  component: KpiCard,
};

export default meta;
type Story = StoryObj<typeof KpiCard>;

export const Default: Story = {
  args: {
    title: "Orders",
    value: "28",
    icon: <ShoppingCart size={16} />,
  },
};

export const WithDeltaPositive: Story = {
  args: {
    title: "Orders",
    value: "28",
    icon: <ShoppingCart size={16} />,
    delta: { value: "+100%", trend: "up" },
    subtitle: "vs prev period",
  },
};

export const WithDeltaNegative: Story = {
  args: {
    title: "Orders",
    value: "12",
    icon: <ShoppingCart size={16} />,
    delta: { value: "-30%", trend: "down" },
    subtitle: "vs prev period",
  },
};

export const WithDeltaNeutral: Story = {
  args: {
    title: "Orders",
    value: "28",
    icon: <ShoppingCart size={16} />,
    delta: { value: "0%", trend: "neutral" },
    subtitle: "vs prev period",
  },
};

export const WithTooltip: Story = {
  args: {
    title: "Avg Order Value",
    value: "$386",
    icon: <TrendingUp size={16} />,
    tooltip: "Total gross revenue divided by number of orders in the selected period",
    delta: { value: "+12%", trend: "up" },
    subtitle: "vs prev period",
  },
};

export const SubtitleOnly: Story = {
  args: {
    title: "Recent orders total",
    value: "USD 355.40",
    subtitle: "Across last 5 orders",
  },
};

export const NoIcon: Story = {
  args: {
    title: "Last login",
    value: "May 14, 1:46 PM",
  },
};

export const Loading: Story = {
  args: {
    title: "Orders",
    value: "—",
    loading: true,
  },
};

export const Active: Story = {
  args: {
    title: "Orders",
    value: "28",
    icon: <ShoppingCart size={16} />,
    delta: { value: "+100%", trend: "up" },
    subtitle: "vs prev period",
    active: true,
    onSelect: fn(),
  },
};

export const Clickable: Story = {
  args: {
    title: "New Customers",
    value: "1",
    icon: <UserPlus size={16} />,
    onSelect: fn(),
  },
};

export const Row: Story = {
  render: () => (
    <Box
      display="grid"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "var(--mu-spacing-4)",
      }}
    >
      <KpiCard
        title="Orders"
        value="28"
        icon={<ShoppingCart size={16} />}
        delta={{ value: "+100%", trend: "up" }}
        subtitle="vs prev period"
      />
      <KpiCard
        title="Avg Order Value"
        value="$386"
        icon={<TrendingUp size={16} />}
        tooltip="Total gross revenue divided by number of orders in the selected period"
        delta={{ value: "+100%", trend: "up" }}
        subtitle="vs prev period"
      />
      <KpiCard
        title="New Customers"
        value="1"
        icon={<UserPlus size={16} />}
        tooltip="Customers who placed their first-ever order during this period"
      />
    </Box>
  ),
};
