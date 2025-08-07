// @ts-strict-ignore
import { SearchPermissionGroupsQuery, StaffErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { FetchMoreProps, RelayToFlat, SearchPageProps } from "@dashboard/types";
import { getFormErrors } from "@dashboard/utils/errors";
import getStaffErrorMessage from "@dashboard/utils/errors/staff";
import { Option, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { Multiselect } from "../Combobox";

export interface AccountPermissionGroupsProps extends FetchMoreProps, SearchPageProps {
  formData: {
    permissionGroups: Option[];
  };
  disabled: boolean;
  errors: StaffErrorFragment[];
  availablePermissionGroups: RelayToFlat<SearchPermissionGroupsQuery["search"]>;
  onChange: FormChange;
}

const AccountPermissionGroups = (props: AccountPermissionGroupsProps) => {
  const {
    availablePermissionGroups,
    disabled,
    errors,
    formData,
    hasMore,
    loading,
    onChange,
    onFetchMore,
    onSearchChange,
  } = props;
  const intl = useIntl();
  const choices = availablePermissionGroups?.map(pg => ({
    disabled: !pg.userCanManage,
    label: pg.name,
    value: pg.id,
  }));
  const formErrors = getFormErrors(["addGroups", "removeGroups"], errors);

  return (
    <>
      <Multiselect
        label={intl.formatMessage({
          id: "C7eDb9",
          defaultMessage: "Permission groups",
        })}
        name="permissionGroups"
        options={disabled ? [] : choices}
        value={formData?.permissionGroups}
        onChange={onChange}
        fetchOptions={onSearchChange}
        fetchMore={{
          onFetchMore,
          hasMore,
          loading,
        }}
        data-test-id="permission-groups"
        error={!!formErrors.addGroups}
        helperText={getStaffErrorMessage(formErrors.addGroups, intl)}
      />
      {!!formErrors.addGroups && (
        <Text color="critical1">{getStaffErrorMessage(formErrors.addGroups, intl)}</Text>
      )}
      {!!formErrors.removeGroups && (
        <Text color="critical1">{getStaffErrorMessage(formErrors.removeGroups, intl)}</Text>
      )}
    </>
  );
};

AccountPermissionGroups.displayName = "AccountPermissionGroups";
export default AccountPermissionGroups;
