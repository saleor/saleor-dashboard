import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { useIntl } from "react-intl";

import { UserError, FetchMoreProps, SearchPageProps } from "@saleor/types";
import { SearchPermissionGroups_search_edges_node } from "@saleor/searches/types/SearchPermissionGroups";
import { getFieldError } from "@saleor/utils/errors";
import { FormChange } from "@saleor/hooks/useForm";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "../MultiAutocompleteSelectField";

interface AccountPermissionGroupsProps extends FetchMoreProps, SearchPageProps {
  data: {
    permissionGroups: string[];
  };
  disabled: boolean;
  errors: UserError[];
  permissionGroups: SearchPermissionGroups_search_edges_node[];
  onChange: FormChange;
  displayValues: MultiAutocompleteChoiceType[];
}

const AccountPermissionGroups: React.FC<AccountPermissionGroupsProps> = props => {
  const {
    data,
    disabled,
    permissionGroups,
    onChange,
    errors,
    hasMore,
    loading,
    onFetchMore,
    onSearchChange,
    displayValues
  } = props;

  const intl = useIntl();

  const choices = permissionGroups?.map(pg => ({
    label: pg.name,
    value: pg.id
  }));

  return (
    <>
      <MultiAutocompleteSelectField
        displayValues={displayValues}
        label={intl.formatMessage({
          defaultMessage: "Permission groups"
        })}
        choices={disabled ? [] : choices}
        name="permissionGroups"
        value={data.permissionGroups}
        onChange={onChange}
        fetchChoices={onSearchChange}
        data-tc="permissionGroups"
        onFetchMore={onFetchMore}
        hasMore={hasMore}
        loading={loading}
      />
      {!!getFieldError(errors, "permissionGroups") && (
        <>
          <CardContent>
            <Typography color="error">
              {getFieldError(errors, "permissionGroups")?.message}
            </Typography>
          </CardContent>
        </>
      )}
    </>
  );
};

AccountPermissionGroups.displayName = "AccountPermissionGroups";
export default AccountPermissionGroups;
