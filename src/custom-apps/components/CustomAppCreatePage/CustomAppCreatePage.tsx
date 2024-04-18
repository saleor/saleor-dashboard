// @ts-strict-ignore
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import Savebar from "@dashboard/components/Savebar";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { AppErrorFragment, PermissionEnum, PermissionFragment } from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getFormErrors } from "@dashboard/utils/errors";
import getAppErrorMessage from "@dashboard/utils/errors/app";
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
  onSubmit: (data: CustomAppCreatePageFormData) => SubmitPromise<AppErrorFragment[]>;
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
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav
            href={CustomAppUrls.resolveAppListUrl()}
            title={intl.formatMessage({
              id: "GjH9uy",
              defaultMessage: "Create New App",
              description: "header",
            })}
          />
          <DetailPageLayout.Content>
            <CustomAppInformation
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
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
          </DetailPageLayout.RightSidebar>
          <Savebar
            disabled={isSaveDisabled}
            state={saveButtonBarState}
            onCancel={() => navigate(CustomAppUrls.resolveAppListUrl())}
            onSubmit={submit}
          />
        </DetailPageLayout>
      )}
    </Form>
  );
};

CustomAppCreatePage.displayName = "CustomAppCreatePage";
export default CustomAppCreatePage;
