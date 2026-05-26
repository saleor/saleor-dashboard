import { customer } from "@dashboard/customers/fixtures";
import { OrderChargeStatusEnum, PaymentChargeStatusEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { CustomerOverview } from "./CustomerOverview";

const meta: Meta<typeof CustomerOverview> = {
  title: "Customers/CustomerOverview",
  component: CustomerOverview,
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

// Customer with orders split across two currencies (e.g. orders placed in
// channels with different currencies). The overview now renders a Spent + AOV
// pair per currency rather than hiding the cards.
export const MultiCurrencyOrders: Story = {
  args: {
    customer: {
      ...customer,
      orders: {
        __typename: "OrderCountableConnection",
        totalCount: 2,
        edges: [
          {
            __typename: "OrderCountableEdge",
            node: {
              __typename: "Order",
              id: "T3JkZXI6MQ==",
              created: "2026-03-26T11:57:00Z",
              number: "0001",
              paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
              chargeStatus: OrderChargeStatusEnum.FULL,
              total: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 100.0,
                  currency: "USD",
                },
              },
            },
          },
          {
            __typename: "OrderCountableEdge",
            node: {
              __typename: "Order",
              id: "T3JkZXI6Mg==",
              created: "2026-02-10T08:00:00Z",
              number: "0002",
              paymentStatus: PaymentChargeStatusEnum.FULLY_CHARGED,
              chargeStatus: OrderChargeStatusEnum.FULL,
              total: {
                __typename: "TaxedMoney",
                gross: {
                  __typename: "Money",
                  amount: 50.0,
                  currency: "EUR",
                },
              },
            },
          },
        ],
      },
    },
  },
};
