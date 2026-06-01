import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { ClickableProductType, ProductTypeDisplay } from "./ProductType";

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
      code: PermissionEnum.MANAGE_PRODUCTS,
      name: "Manage products",
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

const meta: Meta<typeof ProductTypeDisplay> = {
  title: "Components/ProductTypeDisplay",
  component: ProductTypeDisplay,
  args: {
    productType: { id: "UHJvZHVjdFR5cGU6MQ", name: "Apparel" },
  },
};

export default meta;
type Story = StoryObj<typeof ProductTypeDisplay>;

export const Default: Story = {};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const Clickable: Story = {
  render: (args: ComponentProps<typeof ProductTypeDisplay>) => (
    <UserContext.Provider value={mockUserContext}>
      <ClickableProductType {...args} />
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
    productType: undefined,
  },
};

export const LongName: Story = {
  args: {
    productType: {
      id: "UHJvZHVjdFR5cGU6MQ",
      name: "Configurable physical goods with variants",
    },
  },
};
