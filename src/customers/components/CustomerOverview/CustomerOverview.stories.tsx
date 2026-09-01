import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { TimezoneProvider } from "@dashboard/components/Timezone/Timezone";
import { customer } from "@dashboard/customers/fixtures";
import { CustomerDetailsContext } from "@dashboard/customers/providers/CustomerDetailsProvider";
import { OrderStatus, PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps, FC, ReactNode } from "react";
import { fn } from "storybook/test";

import { CustomerOverview } from "./CustomerOverview";

const staffUser = (permissions: PermissionEnum[]): UserFragment => ({
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isActive: true,
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: permissions.map(code => ({
    __typename: "UserPermission" as const,
    code,
    name: code,
  })),
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
});

const staffContext = (permissions: PermissionEnum[]): UserContextType => ({
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: true,
  errors: [],
  refetchUser: undefined,
  user: staffUser(permissions),
});

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
  refetch: async () => undefined,
  setKpiChannelId: fn(),
});

type OverviewCustomer = NonNullable<ComponentProps<typeof CustomerOverview>["customer"]>;

const withCustomer = (overrides: Partial<OverviewCustomer>): OverviewCustomer => ({
  ...customer,
  ...overrides,
});

const OverviewProviders = ({
  children,
  permissions = [PermissionEnum.MANAGE_ORDERS],
  kpiContext = withKpiContext(),
}: {
  children: ReactNode;
  permissions?: PermissionEnum[];
  kpiContext?: ReturnType<typeof withKpiContext>;
}): JSX.Element => (
  <UserContext.Provider value={staffContext(permissions)}>
    <TimezoneProvider value="America/New_York">
      <CustomerDetailsContext.Provider value={kpiContext}>
        {children}
      </CustomerDetailsContext.Provider>
    </TimezoneProvider>
  </UserContext.Provider>
);

const meta: Meta<typeof CustomerOverview> = {
  title: "Customers/CustomerOverview",
  component: CustomerOverview,
  decorators: [
    (Story: FC) => (
      <OverviewProviders>
        <Story />
      </OverviewProviders>
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
  decorators: [
    (Story: FC) => (
      <OverviewProviders kpiContext={{ ...withKpiContext(), kpiChannels: [] }}>
        <Story />
      </OverviewProviders>
    ),
  ],
  args: {
    customer: withCustomer({
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
    }),
  },
};

export const NeverLoggedIn: Story = {
  args: {
    customer: withCustomer({ lastLogin: null }),
  },
};

export const WithoutOrderPermissions: Story = {
  decorators: [
    (Story: FC) => (
      <OverviewProviders permissions={[PermissionEnum.MANAGE_USERS]}>
        <Story />
      </OverviewProviders>
    ),
  ],
  args: {
    customer,
  },
};

export const NetSalesVsCheckoutTotal: Story = {
  args: {
    customer: withCustomer({
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
    }),
  },
};

export const MultiChannelOrders: Story = {
  decorators: [
    (Story: FC) => (
      <OverviewProviders
        kpiContext={{
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
      </OverviewProviders>
    ),
  ],
  args: {
    customer: withCustomer({
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
    }),
  },
};

export const WithRefundsAndShipping: Story = {
  args: {
    customer: withCustomer({
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
    }),
  },
};
