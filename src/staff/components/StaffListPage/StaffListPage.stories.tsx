import {
  filterPageProps,
  limits,
  limitsReached,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps,
} from "@saleor/fixtures";
import { StaffMemberStatus } from "@saleor/graphql";
import { staffMembers } from "@saleor/staff/fixtures";
import { StaffListUrlSortField } from "@saleor/staff/urls";
import Decorator from "@saleor/storybook/Decorator";
import { PaginatorContextDecorator } from "@saleor/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
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

storiesOf("Views / Staff / Staff members", module)
  .addDecorator(Decorator)
  .addDecorator(PaginatorContextDecorator)
  .add("default", () => <StaffListPage {...props} />)
  .add("when loading", () => (
    <StaffListPage {...props} disabled={true} staffMembers={undefined} />
  ))
  .add("no limits", () => <StaffListPage {...props} limits={undefined} />)
  .add("limits reached", () => (
    <StaffListPage {...props} limits={limitsReached} />
  ));
