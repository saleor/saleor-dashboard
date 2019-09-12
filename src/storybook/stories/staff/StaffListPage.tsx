import { storiesOf } from "@storybook/react";
import React from "react";

import {
  pageListProps,
  searchPageProps,
  tabPageProps
} from "../../../fixtures";
import StaffListPage, {
  StaffListPageProps
} from "../../../staff/components/StaffListPage";
import { staffMembers } from "../../../staff/fixtures";
import Decorator from "../../Decorator";

const props: StaffListPageProps = {
  ...pageListProps.default,
  ...searchPageProps,
  ...tabPageProps,
  onAdd: undefined,
  onBack: () => undefined,
  staffMembers
};

storiesOf("Views / Staff / Staff members", module)
  .addDecorator(Decorator)
  .add("default", () => <StaffListPage {...props} />)
  .add("when loading", () => (
    <StaffListPage {...props} disabled={true} staffMembers={undefined} />
  ));
