import {
  filterPageProps,
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import { StaffMemberStatus } from "@saleor/graphql";
import { staffMembers } from "@saleor/staff/fixtures";
import { StaffListUrlSortField } from "@saleor/staff/urls";
import Decorator from "@saleor/storybook/Decorator";
import React from "react";

import StaffListPage, { StaffListPageProps } from ".";

const props: StaffListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
  filterOpts: {
    status: {
      active: false,
      value: StaffMemberStatus.ACTIVE
    }
  },
  limits,
  onAdd: undefined,
  onBack: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: StaffListUrlSortField.name
  },
  staffMembers
};

export default {
  title: "Views / Staff / Staff members",
  decorators: [Decorator]
};

export const Default = () => <StaffListPage {...props} />;

Default.story = {
  name: "default"
};

export const WhenLoading = () => (
  <StaffListPage {...props} disabled={true} staffMembers={undefined} />
);

WhenLoading.story = {
  name: "when loading"
};

export const NoLimits = () => <StaffListPage {...props} limits={undefined} />;

NoLimits.story = {
  name: "no limits"
};

export const LimitsReached = () => (
  <StaffListPage {...props} limits={limitsReached} />
);

LimitsReached.story = {
  name: "limits reached"
};
