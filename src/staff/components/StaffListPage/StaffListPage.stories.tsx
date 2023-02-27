// @ts-strict-ignore
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
import Decorator from "@dashboard/storybook/Decorator";
import { PaginatorContextDecorator } from "@dashboard/storybook/PaginatorContextDecorator";
import { storiesOf } from "@storybook/react";
import React from "react";

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

storiesOf("Staff / Staff members", module)
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
