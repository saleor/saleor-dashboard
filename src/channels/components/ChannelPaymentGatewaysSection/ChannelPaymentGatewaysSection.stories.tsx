import { type ChannelPaymentApp } from "@dashboard/channels/hooks/useChannelPaymentApps";
import { AppWidgets } from "@dashboard/extensions/components/AppWidgets/AppWidgets";
import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { AppTypeEnum, CircuitBreakerStateEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps, type ComponentType, type ReactElement } from "react";
import { fn } from "storybook/test";

import { ChannelPaymentGatewaysSection } from "./ChannelPaymentGatewaysSection";

const paymentApp = (overrides: Partial<ChannelPaymentApp> = {}): ChannelPaymentApp => ({
  id: "stripe-app",
  name: "Stripe",
  isActive: true,
  type: AppTypeEnum.THIRDPARTY,
  appUrl: "https://stripe.example.com",
  logoUrl: null,
  breakerState: CircuitBreakerStateEnum.CLOSED,
  hasCriticalProblem: false,
  ...overrides,
});

const healthyApps: ChannelPaymentApp[] = [
  paymentApp(),
  paymentApp({
    id: "adyen-app",
    name: "Adyen",
    appUrl: "https://adyen.example.com",
  }),
];

const mixedHealthApps: ChannelPaymentApp[] = [
  paymentApp({
    id: "stripe-app",
    name: "Stripe",
    breakerState: CircuitBreakerStateEnum.OPEN,
  }),
  paymentApp({
    id: "adyen-app",
    name: "Adyen",
    appUrl: "https://adyen.example.com",
    hasCriticalProblem: true,
  }),
  paymentApp({
    id: "dummy-app",
    name: "Dummy Payment",
    appUrl: "https://dummy.example.com",
  }),
];

const cachedWidget: ExtensionWithParams = {
  id: "stripe-channel-widget",
  app: {
    __typename: "App",
    id: "stripe-app",
    appUrl: "https://stripe.example.com",
    name: "Stripe",
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: "Stripe channel configuration",
  identifier: null,
  mountName: "CHANNEL_DETAILS_WIDGETS",
  url: "https://stripe.example.com/config",
  open: fn(),
  targetName: "WIDGET",
  settings: {},
  isSaleorOfficial: true,
  fromCache: true,
};

const meta: Meta<typeof ChannelPaymentGatewaysSection> = {
  title: "Channels / ChannelPaymentGatewaysSection",
  component: ChannelPaymentGatewaysSection,
  args: {
    apps: mixedHealthApps,
    loading: false,
    hasMoreApps: false,
  },
  decorators: [
    (Story: ComponentType): ReactElement => (
      <Box padding={6} __maxWidth="40rem" backgroundColor="default1">
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChannelPaymentGatewaysSection>;

export const MixedHealth: Story = {};

export const Healthy: Story = {
  args: {
    apps: healthyApps,
  },
};

export const Empty: Story = {
  args: {
    apps: [],
  },
};

export const Loading: Story = {
  args: {
    apps: [],
    loading: true,
  },
};

export const WithChannelWidgets: Story = {
  render: (args: ComponentProps<typeof ChannelPaymentGatewaysSection>): ReactElement => (
    <Box display="flex" flexDirection="column" gap={4}>
      <ChannelPaymentGatewaysSection {...args} />
      <AppWidgets extensions={[cachedWidget]} params={{ channelId: "Q2hhbm5lbDox" }} />
    </Box>
  ),
};
