import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import { AttributeTypeEnum, PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ComponentProps } from "react";

import { AttributeClassDisplay, ClickableAttributeClass } from "./AttributeClass";

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
      code: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
      name: "Manage product types and attributes",
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

const meta: Meta<typeof AttributeClassDisplay> = {
  title: "Components/AttributeClassDisplay",
  component: AttributeClassDisplay,
  args: {
    attributeType: AttributeTypeEnum.PRODUCT_TYPE,
  },
};

export default meta;
type Story = StoryObj<typeof AttributeClassDisplay>;

export const Default: Story = {};

export const ModelAttribute: Story = {
  args: {
    attributeType: AttributeTypeEnum.PAGE_TYPE,
  },
};

export const WithoutIcon: Story = {
  args: {
    hideIcon: true,
  },
};

export const Clickable: Story = {
  render: (args: ComponentProps<typeof AttributeClassDisplay>) => (
    <UserContext.Provider value={mockUserContext}>
      <ClickableAttributeClass {...args} />
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
    attributeType: undefined,
  },
};
