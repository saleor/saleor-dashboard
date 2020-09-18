import AccountPermissions from "@saleor/components/AccountPermissions";
import AppHeader from "@saleor/components/AppHeader";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { PermissionGroupErrorFragment } from "@saleor/fragments/types/PermissionGroupErrorFragment";
import { sectionNames } from "@saleor/intl";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getPermissionGroupErrorMessage from "@saleor/utils/errors/permissionGroups";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionData } from "../PermissionGroupDetailsPage";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreatePageFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreatePageFormData = {
  hasFullAccess: false,
  isActive: false,
  name: "",
  permissions: []
};

export interface PermissionGroupCreatePageProps {
  disabled: boolean;
  errors: PermissionGroupErrorFragment[];
  permissions: PermissionData[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit(data: PermissionGroupCreatePageFormData);
}

const PermissionGroupCreatePage: React.FC<PermissionGroupCreatePageProps> = ({
  disabled,
  permissions,
  onBack,
  onSubmit,
  saveButtonBarState,
  errors
}) => {
  const intl = useIntl();

  const formErrors = getFormErrors(["addPermissions"], errors || []);
  const permissionsError = getPermissionGroupErrorMessage(
    formErrors.addPermissions,
    intl
  );

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
      {({ data, change, submit, hasChanged }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.permissionGroups)}
          </AppHeader>
          <Grid>
            <div>
              <PermissionGroupInfo
                data={data}
                errors={errors}
                onChange={change}
                disabled={disabled}
              />
            </div>
            <div>
              <AccountPermissions
                permissionsExceeded={false}
                data={data}
                errorMessage={permissionsError}
                disabled={disabled}
                permissions={permissions}
                onChange={change}
                fullAccessLabel={intl.formatMessage({
                  defaultMessage: "Group has full access to the store",
                  description: "checkbox label"
                })}
                description={intl.formatMessage({
                  defaultMessage:
                    "Expand or restrict group's permissions to access certain part of saleor system.",
                  description: "card description"
                })}
              />
            </div>
          </Grid>
          <div>
            <SaveButtonBar
              onCancel={onBack}
              onSave={submit}
              state={saveButtonBarState}
              disabled={disabled || !hasChanged}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
