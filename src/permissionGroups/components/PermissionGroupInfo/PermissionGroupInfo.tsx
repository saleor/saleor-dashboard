// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { PermissionGroupErrorFragment } from "@dashboard/graphql";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import { getFieldError, getFormErrors } from "@dashboard/utils/errors";
import getPermissionGroupErrorMessage from "@dashboard/utils/errors/permissionGroups";
import { TextField } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

export interface PermissionGroupInfoProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  onChange: FormChange;
  data: {
    name: string;
  };
}

const PermissionGroupInfo = ({ disabled, onChange, data, errors }: PermissionGroupInfoProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          {intl.formatMessage(commonMessages.generalInformations)}
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <TextField
          data-test-id="permission-group-name-input"
          name="name"
          label={intl.formatMessage({
            id: "rs815i",
            defaultMessage: "Group name",
            description: "text field label",
          })}
          value={data.name}
          onChange={onChange}
          disabled={disabled}
          error={!!getFieldError(errors, "name")}
          helperText={getPermissionGroupErrorMessage(formErrors.name, intl)}
          fullWidth
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

PermissionGroupInfo.displayName = "PermissionGroupInfo";
export default PermissionGroupInfo;
