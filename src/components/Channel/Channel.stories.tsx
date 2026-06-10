import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { ChannelDisplay, ClickableChannel } from "./Channel";

const mockUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_ORDERS,
      name: "Manage orders",
    },
  ],
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

const mockUserContext: UserContextType = {
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: true,
  errors: [],
  refetchUser: undefined,
  user: mockUser,
};

const meta: Meta<typeof ChannelDisplay> = {
  title: "Components/ChannelDisplay",
  component: ChannelDisplay,
  args: {
    channel: { id: "Q2hhbm5lbDox", name: "Channel-USD", slug: "channel-usd", isActive: true },
  },
};

export default meta;
type Story = StoryObj<typeof ChannelDisplay>;

export const Default: Story = {};

export const Inactive: Story = {
  args: {
    channel: { id: "Q2hhbm5lbDox", name: "Channel-USD", slug: "channel-usd", isActive: false },
  },
};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const Clickable: Story = {
  render: (args: ComponentProps<typeof ChannelDisplay>) => (
    <UserContext.Provider value={mockUserContext}>
      <ClickableChannel {...args} />
    </UserContext.Provider>
  ),
};

export const LargerSize: Story = {
  args: {
    size: 4,
    color: "default1",
  },
};

export const Loading: Story = {
  args: {
    channel: undefined,
  },
};

export const LongName: Story = {
  args: {
    channel: {
      id: "Q2hhbm5lbDox",
      name: "European Union Storefront Channel (EUR)",
      slug: "eu-storefront",
      isActive: true,
    },
  },
};
