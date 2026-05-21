import { PermissionEnum, type UserFragment } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useIntl } from "react-intl";

import { ConfigurationPage } from "./ConfigurationPage";
import { createConfigurationMenu } from "./createConfigurationMenu";

const allPermissions = Object.values(PermissionEnum).map(code => ({
  __typename: "UserPermission" as const,
  code,
  name: code,
}));

const adminUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isStaff: true,
  dateJoined: "2025-01-01T00:00:00Z",
  restrictedAccessToChannels: false,
  metadata: [],
  userPermissions: allPermissions,
  avatar: null,
  accessibleChannels: null,
};

const limitedUser: UserFragment = {
  ...adminUser,
  userPermissions: [
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_PRODUCT_TYPES_AND_ATTRIBUTES,
      name: "Manage product types and attributes",
    },
    {
      __typename: "UserPermission",
      code: PermissionEnum.MANAGE_SHIPPING,
      name: "Manage shipping",
    },
  ],
};

const ConfigurationPageWithMenu = ({ user }: { user: UserFragment }) => {
  const intl = useIntl();

  return (
    <ConfigurationPage
      menu={createConfigurationMenu(intl)}
      user={user}
      versionInfo={{ dashboardVersion: "3.23.0", coreVersion: "3.23.0" }}
    />
  );
};

const meta: Meta<typeof ConfigurationPageWithMenu> = {
  title: "Configuration/ConfigurationPage",
  component: ConfigurationPageWithMenu,
};

export default meta;
type Story = StoryObj<typeof ConfigurationPageWithMenu>;

export const FullAccess: Story = {
  args: { user: adminUser },
};

export const LimitedPermissions: Story = {
  args: { user: limitedUser },
};
