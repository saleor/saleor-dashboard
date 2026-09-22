import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { ClickableCustomerType, CustomerTypeDisplay } from "./CustomerType";

const mockUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isActive: true,
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_USERS,
      name: "Manage users",
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

const meta: Meta<typeof CustomerTypeDisplay> = {
  title: "Components/CustomerTypeDisplay",
  component: CustomerTypeDisplay,
  args: {
    customerType: { id: "Q3VzdG9tZXJUeXBlOjE=", name: "B2B", slug: "b2b" },
  },
};

export default meta;
type Story = StoryObj<typeof CustomerTypeDisplay>;

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const Clickable: Story = {
  render: (args: ComponentProps<typeof CustomerTypeDisplay>) => (
    <UserContext.Provider value={mockUserContext}>
      <ClickableCustomerType {...args} />
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
    customerType: undefined,
  },
};

export const LongName: Story = {
  args: {
    customerType: {
      id: "Q3VzdG9tZXJUeXBlOjE=",
      name: "Wholesale partners with negotiated terms",
      slug: "wholesale",
    },
  },
};
