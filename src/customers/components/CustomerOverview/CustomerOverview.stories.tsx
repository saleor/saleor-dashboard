import { customer } from "@dashboard/customers/fixtures";
import { CustomerDetailsContext } from "@dashboard/customers/providers/CustomerDetailsProvider";
import { OrderStatus } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { FC } from "react";

import { CustomerOverview } from "./CustomerOverview";

const kpiOrderNode = {
  __typename: "Order" as const,
  id: "T3JkZXI6MQ==",
  created: "2026-03-26T11:57:00Z",
  status: OrderStatus.FULFILLED,
  subtotal: {
    __typename: "TaxedMoney" as const,
    net: {
      __typename: "Money" as const,
      amount: 142.68,
      currency: "USD",
    },
  },
  shippingPrice: {
    __typename: "TaxedMoney" as const,
    gross: {
      __typename: "Money" as const,
      amount: 34.2,
      currency: "USD",
    },
  },
  totalRefunded: {
    __typename: "Money" as const,
    amount: 0,
    currency: "USD",
  },
  channel: {
    __typename: "Channel" as const,
    id: "Q2hhbm5lbDox",
    name: "United States",
    slug: "us",
    isActive: true,
    currencyCode: "USD",
  },
};

const withKpiContext = (channelId = "Q2hhbm5lbDox") => ({
  customer: null,
  effectiveKpiChannelId: channelId,
  kpiChannelId: channelId,
  kpiChannels: [
    {
      id: "Q2hhbm5lbDox",
      name: "United States",
      slug: "us",
      isActive: true,
      currencyCode: "USD",
    },
  ],
  loading: false,
  setKpiChannelId: () => undefined,
});

const meta: Meta<typeof CustomerOverview> = {
  title: "Customers/CustomerOverview",
  component: CustomerOverview,
  decorators: [
    (Story: FC) => (
      <CustomerDetailsContext.Provider value={withKpiContext()}>
        <Story />
      </CustomerDetailsContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CustomerOverview>;

export const Default: Story = {
  args: {
    customer,
  },
};

export const Loading: Story = {
  args: {
    customer: null,
  },
};

export const NoOrders: Story = {
  args: {
    customer: {
      ...customer,
      orders: {
        __typename: "OrderCountableConnection",
        totalCount: 0,
        edges: [],
      },
      kpiOrderChannels: {
        __typename: "OrderCountableConnection",
        edges: [],
      },
      kpiOrders: {
        __typename: "OrderCountableConnection",
        edges: [],
      },
      kpiNonCancelledOrderCount: {
        __typename: "OrderCountableConnection",
        totalCount: 0,
      },
    },
  },
};

export const NeverLoggedIn: Story = {
  args: {
    customer: {
      ...customer,
      lastLogin: null,
    },
  },
};

export const NetSalesVsCheckoutTotal: Story = {
  args: {
    customer: {
      ...customer,
      kpiOrders: {
        __typename: "OrderCountableConnection",
        edges: [
          {
            __typename: "OrderCountableEdge",
            node: kpiOrderNode,
          },
        ],
      },
      kpiNonCancelledOrderCount: {
        __typename: "OrderCountableConnection",
        totalCount: 1,
      },
    },
  },
};

export const MultiChannelOrders: Story = {
  decorators: [
    (Story: FC) => (
      <CustomerDetailsContext.Provider
        value={{
          ...withKpiContext("Q2hhbm5lbDox"),
          kpiChannels: [
            {
              id: "Q2hhbm5lbDox",
              name: "United States",
              slug: "us",
              isActive: true,
              currencyCode: "USD",
            },
            {
              id: "Q2hhbm5lbDoy",
              name: "Europe",
              slug: "eu",
              isActive: true,
              currencyCode: "EUR",
            },
          ],
        }}
      >
        <Story />
      </CustomerDetailsContext.Provider>
    ),
  ],
  args: {
    customer: {
      ...customer,
      kpiOrderChannels: {
        __typename: "OrderCountableConnection",
        edges: [
          {
            __typename: "OrderCountableEdge",
            node: {
              ...kpiOrderNode,
            },
          },
          {
            __typename: "OrderCountableEdge",
            node: {
              ...kpiOrderNode,
              id: "T3JkZXI6Mg==",
              created: "2026-02-10T08:00:00Z",
              channel: {
                __typename: "Channel",
                id: "Q2hhbm5lbDoy",
                name: "Europe",
                slug: "eu",
                isActive: true,
                currencyCode: "EUR",
              },
            },
          },
        ],
      },
      kpiOrders: {
        __typename: "OrderCountableConnection",
        edges: [
          {
            __typename: "OrderCountableEdge",
            node: kpiOrderNode,
          },
        ],
      },
      kpiNonCancelledOrderCount: {
        __typename: "OrderCountableConnection",
        totalCount: 1,
      },
    },
  },
};

export const WithRefundsAndShipping: Story = {
  args: {
    customer: {
      ...customer,
      kpiOrders: {
        __typename: "OrderCountableConnection",
        edges: [
          {
            __typename: "OrderCountableEdge",
            node: {
              ...kpiOrderNode,
              totalRefunded: {
                __typename: "Money",
                amount: 25,
                currency: "USD",
              },
            },
          },
        ],
      },
      kpiNonCancelledOrderCount: {
        __typename: "OrderCountableConnection",
        totalCount: 1,
      },
    },
  },
};
