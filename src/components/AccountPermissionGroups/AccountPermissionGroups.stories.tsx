import {
  AccountErrorCode,
  SearchPermissionGroupsQuery,
  StaffErrorFragment
} from "@saleor/graphql";
import Decorator from "@saleor/storybook/Decorator";
import { RelayToFlat } from "@saleor/types";
import React from "react";

import { MultiAutocompleteChoiceType } from "../MultiAutocompleteSelectField";
import AccountPermissionGroups, { AccountPermissionGroupsProps } from ".";

const availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]> = [
  {
    __typename: "Group",
    id: "R3JvdXA6MQ==",
    name: "Unmanagable by user",
    userCanManage: false
  },
  {
    __typename: "Group",
    id: "R3JvdXA6Mg==",
    name: "Default group",
    userCanManage: true
  },
  {
    __typename: "Group",
    id: "R3JvdXA6Mz==",
    name: "Translators",
    userCanManage: false
  },
  {
    __typename: "Group",
    id: "R3JvdXA6My==",
    name: "CMS",
    userCanManage: true
  }
];

const displayValues: MultiAutocompleteChoiceType[] = [
  { disabled: true, label: "Unmanagable by user", value: "R3JvdXA6MQ==" },
  { disabled: false, label: "Default group", value: "R3JvdXA6Mg==" }
];

const formData = {
  permissionGroups: ["R3JvdXA6MQ==", "R3JvdXA6Mg=="]
};

const errors: StaffErrorFragment[] = [
  {
    __typename: "StaffError",
    code: AccountErrorCode.OUT_OF_SCOPE_GROUP,
    field: "addGroups",
    message: "Group out of scope"
  }
];

const props: AccountPermissionGroupsProps = {
  availablePermissionGroups,
  disabled: false,
  displayValues,
  errors: [],
  formData,
  hasMore: false,
  initialSearch: "",
  loading: false,
  onChange: () => undefined,
  onFetchMore: () => undefined,
  onSearchChange: () => undefined
};

export default {
  title: "Generics / Account Permission Groups Widget",
  decorators: [Decorator]
};

export const Default = () => <AccountPermissionGroups {...props} />;

Default.story = {
  name: "default"
};

export const Error = () => (
  <AccountPermissionGroups {...props} errors={errors} />
);

Error.story = {
  name: "error"
};
