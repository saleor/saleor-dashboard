import type { SearchStaffMembersQuery } from "@dashboard/graphql";
import type { RelayToFlat } from "@dashboard/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef } from "react";
import { fn } from "storybook/test";

import AssignMembersDialog from "./AssignMembersDialog";

const staffMembers: RelayToFlat<SearchStaffMembersQuery["search"]> = [
  {
    __typename: "User",
    id: "user-1",
    firstName: "Alice",
    lastName: "Smith",
    email: "alice.smith@example.com",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "user-2",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "user-3",
    firstName: "Carol",
    lastName: "Williams",
    email: "carol.williams@example.com",
    isActive: false,
    avatar: null,
  },
  {
    __typename: "User",
    id: "user-4",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "user-5",
    firstName: "Eva",
    lastName: "Davis",
    email: "eva.davis@example.com",
    isActive: true,
    avatar: null,
  },
  {
    __typename: "User",
    id: "user-6",
    firstName: "Frank",
    lastName: "Miller",
    email: "frank.miller@example.com",
    isActive: false,
    avatar: null,
  },
];

const meta: Meta<typeof AssignMembersDialog> = {
  title: "Components/Dialogs/AssignMembersDialog",
  component: AssignMembersDialog,
  render: args => {
    const onSearchChangeRef = useRef(args.onSearchChange);

    onSearchChangeRef.current = args.onSearchChange;

    const stableOnSearchChange = useRef((query: string) => {
      setTimeout(() => onSearchChangeRef.current?.(query), 0);
    });

    return <AssignMembersDialog {...args} onSearchChange={stableOnSearchChange.current} />;
  },
  argTypes: {
    confirmButtonState: {
      control: "inline-radio",
      options: ["default", "loading", "success", "error"],
    },
    onClose: { table: { disable: true } },
    onFetchMore: { table: { disable: true } },
    onSearchChange: { table: { disable: true } },
    onSubmit: { table: { disable: true } },
    staffMembers: { table: { disable: true } },
  },
  args: {
    open: true,
    loading: false,
    hasMore: false,
    disabled: false,
    confirmButtonState: "default",
    staffMembers,
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
  args: { loading: true, staffMembers: [] },
};

export const Empty: Story = {
  args: { staffMembers: [] },
};
