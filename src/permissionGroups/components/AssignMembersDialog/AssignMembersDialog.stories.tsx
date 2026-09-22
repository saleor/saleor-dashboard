import { type SearchStaffMembersQuery } from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import AssignMembersDialog from "./AssignMembersDialog";

type StaffMembers = RelayToFlat<SearchStaffMembersQuery["search"]>;

const staffMembers: StaffMembers = [
  {
    __typename: "User",
    id: "1",
    email: "admin@example.com",
    firstName: "Ada",
    lastName: "Lovelace",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "2",
    email: "bryan.rodgers@example.com",
    firstName: "Bryan",
    lastName: "Rodgers",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "3",
    email: "inactive@example.com",
    firstName: "Sam",
    lastName: "Carter",
    isActive: false,
    avatar: null,
  },
];

const meta: Meta<typeof AssignMembersDialog> = {
  title: "Permission groups/AssignMembersDialog",
  component: AssignMembersDialog,
  args: {
    open: true,
    confirmButtonState: "default",
    disabled: false,
    staffMembers,
    hasMore: false,
    loading: false,
    initialSearch: "",
    onClose: fn(),
    onFetchMore: fn(),
    onSearchChange: fn(),
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AssignMembersDialog>;

export const Default: Story = {};

export const Loading: Story = {
  args: { staffMembers: [], loading: true },
};

export const Empty: Story = {
  args: { staffMembers: [] },
};
