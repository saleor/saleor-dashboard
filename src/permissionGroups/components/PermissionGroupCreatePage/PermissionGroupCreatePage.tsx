import AccountPermissions from "@saleor/components/AccountPermissions";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Savebar from "@saleor/components/Savebar";
import { PermissionEnum, PermissionGroupErrorFragment } from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { Backlink, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getPermissionGroupErrorMessage from "@saleor/utils/errors/permissionGroups";
import React from "react";
import { useIntl } from "react-intl";

import { PermissionData } from "../PermissionGroupDetailsPage";
import PermissionGroupInfo from "../PermissionGroupInfo";

export interface PermissionGroupCreateFormData {
  name: string;
  hasFullAccess: boolean;
  isActive: boolean;
  permissions: PermissionEnum[];
}

const initialForm: PermissionGroupCreateFormData = {
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
  onSubmit: (data: PermissionGroupCreateFormData) => SubmitPromise;
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
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => (
        <Container>
          <Backlink onClick={onBack}>
            {intl.formatMessage(sectionNames.permissionGroups)}
          </Backlink>
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
            <Savebar
              onCancel={onBack}
              onSubmit={submit}
              state={saveButtonBarState}
              disabled={isSaveDisabled}
            />
          </div>
        </Container>
      )}
    </Form>
  );
};
PermissionGroupCreatePage.displayName = "PermissionGroupCreatePage";
export default PermissionGroupCreatePage;
