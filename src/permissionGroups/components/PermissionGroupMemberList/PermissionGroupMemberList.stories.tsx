import { listActionsProps, sortPageProps } from "@dashboard/fixtures";
import { type PermissionGroupMemberFragment } from "@dashboard/graphql";
import { MembersListUrlSortField } from "@dashboard/permissionGroups/urls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import PermissionGroupMemberList from "./PermissionGroupMemberList";

const users: PermissionGroupMemberFragment[] = [
  {
    __typename: "User",
    id: "1",
    email: "joshua.mitchell@example.com",
    firstName: "Joshua",
    lastName: "Mitchell",
    isActive: true,
    lastLogin: "2026-08-20T10:00:00+00:00",
    avatar: null,
  },
  {
    __typename: "User",
    id: "2",
    email: "elizabeth.vaughn@example.com",
    firstName: "Elizabeth",
    lastName: "Vaughn",
    isActive: true,
    lastLogin: null,
    avatar: null,
  },
  {
    __typename: "User",
    id: "3",
    email: "deactivated@example.com",
    firstName: "Sam",
    lastName: "Carter",
    isActive: false,
    lastLogin: "2026-01-04T09:30:00+00:00",
    avatar: null,
  },
];

const meta: Meta<typeof PermissionGroupMemberList> = {
  title: "Permission groups/PermissionGroupMemberList",
  component: PermissionGroupMemberList,
  args: {
    ...listActionsProps,
    ...sortPageProps,
    sort: { ...sortPageProps.sort, sort: MembersListUrlSortField.name },
    users,
    disabled: false,
    onAssign: fn(),
    onUnassign: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof PermissionGroupMemberList>;

export const Default: Story = {};

export const WithSelection: Story = {
  args: { selected: 2, isChecked: () => true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Empty: Story = {
  args: { users: [] },
};
