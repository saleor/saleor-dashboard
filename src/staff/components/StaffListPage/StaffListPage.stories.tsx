import {
  filterPageProps,
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@dashboard/fixtures";
import { StaffMemberStatus } from "@dashboard/graphql";
import { staffMembers } from "@dashboard/staff/fixtures";
import { StaffListUrlSortField } from "@dashboard/staff/urls";
import React from "react";

import { PaginatorContextDecorator } from "../../../../.storybook/decorators";
import StaffListPage, { StaffListPageProps } from "./StaffListPage";

const props: StaffListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
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
};

export default {
  title: "Staff / Staff members",
  decorators: [PaginatorContextDecorator],
};

export const Default = () => <StaffListPage {...props} />;

export const WhenLoading = () => (
  <StaffListPage {...props} disabled={true} staffMembers={undefined} />
);

export const NoLimits = () => <StaffListPage {...props} limits={undefined} />;

export const LimitsReached = () => (
  <StaffListPage {...props} limits={limitsReached} />
);
