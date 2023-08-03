// @ts-strict-ignore
import {
  filterPageProps,
  filterPresetsProps,
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
} from "@dashboard/fixtures";
import { StaffMemberStatus } from "@dashboard/graphql";
import { staffMembers } from "@dashboard/staff/fixtures";
import { StaffListUrlSortField } from "@dashboard/staff/urls";
import { Meta, StoryObj } from "@storybook/react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import StaffListPage, { StaffListPageProps } from "./StaffListPage";

const props: StaffListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...filterPageProps,
  ...filterPresetsProps,
  filterOpts: {
    status: {
      active: false,
      value: StaffMemberStatus.ACTIVE,
    },
  },
  limits,
  onAdd: undefined,
  sort: {
    ...sortPageProps.sort,
    sort: StaffListUrlSortField.name,
  },
  staffMembers,
  settings: {
    rowNumber: 10,
    columns: ["name", "email", "status"],
  },
};

const meta: Meta<typeof StaffListPage> = {
  title: "Staff / Staff members",
  decorators: [PaginatorContextDecorator],
  component: StaffListPage,
};
export default meta;
type Story = StoryObj<typeof StaffListPage>;

export const Default: Story = {
  args: {
    ...props,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const WhenLoading: Story = {
  args: {
    ...props,
    disabled: true,
    staffMembers: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const NoLimits: Story = {
  args: {
    ...props,
    limits: undefined,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};

export const LimitsReached: Story = {
  args: {
    ...props,
    limits: limitsReached,
  },
  parameters: {
    chromatic: { diffThreshold: 0.85 },
  },
};
