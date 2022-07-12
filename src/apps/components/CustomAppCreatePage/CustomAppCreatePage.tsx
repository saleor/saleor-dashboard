import { appsListUrl } from "@saleor/apps/urls";
import AccountPermissions from "@saleor/components/AccountPermissions";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  AppErrorFragment,
  PermissionEnum,
  PermissionFragment,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getAppErrorMessage from "@saleor/utils/errors/app";
import React from "react";
import { useIntl } from "react-intl";

import CustomAppInformation from "../CustomAppInformation";

export interface CustomAppCreatePageFormData {
  hasFullAccess: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface CustomAppCreatePageProps {
  disabled: boolean;
  errors: AppErrorFragment[];
  permissions: PermissionFragment[];
  saveButtonBarState: ConfirmButtonTransitionState;
  onSubmit: (
    data: CustomAppCreatePageFormData,
  ) => SubmitPromise<AppErrorFragment[]>;
}

const CustomAppCreatePage: React.FC<CustomAppCreatePageProps> = props => {
  const { disabled, errors, permissions, saveButtonBarState, onSubmit } = props;
  const intl = useIntl();
  const navigate = useNavigator();

  const initialForm: CustomAppCreatePageFormData = {
    hasFullAccess: false,
    name: "",
    permissions: [],
  };

  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

  return (
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => (
        <Container>
          <Backlink href={appsListUrl()}>
            {intl.formatMessage(sectionNames.apps)}
          </Backlink>
          <PageHeader
            title={intl.formatMessage({
              id: "GjH9uy",
              defaultMessage: "Create New App",
              description: "header",
            })}
          />
          <Grid>
            <div>
              <CustomAppInformation
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
            </div>
            <AccountPermissions
              data={data}
              errorMessage={permissionsError}
              disabled={disabled}
              permissions={permissions}
              permissionsExceeded={false}
              onChange={change}
              fullAccessLabel={intl.formatMessage({
                id: "D4nzdD",
                defaultMessage: "Grant this app full access to the store",
                description: "checkbox label",
              })}
              description={intl.formatMessage({
                id: "flP8Hj",
                defaultMessage:
                  "Expand or restrict app permissions to access certain part of Saleor system.",
                description: "card description",
              })}
            />
          </Grid>
          <Savebar
            disabled={isSaveDisabled}
            state={saveButtonBarState}
            onCancel={() => navigate(appsListUrl())}
            onSubmit={submit}
          />
        </Container>
      )}
    </Form>
  );
};

CustomAppCreatePage.displayName = "CustomAppCreatePage";
export default CustomAppCreatePage;
