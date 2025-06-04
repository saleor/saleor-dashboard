// @ts-strict-ignore
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import AppHeaderOptions from "@dashboard/extensions/components/AppHeaderOptions";
import { appMessages } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
import {
  AppErrorFragment,
  AppUpdateMutation,
  PermissionEnum,
  ShopInfoQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getFormErrors } from "@dashboard/utils/errors";
import { Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomExtensionDefaultToken from "../CustomExtensionDefaultToken";
import CustomExtensionInformation from "../CustomExtensionInformation";
import CustomExtensionTokens from "../CustomExtensionTokens";
import { WebhooksList } from "../WebhooksList";

export interface CustomExtensionDetailsPageFormData {
  hasFullAccess: boolean;
  isActive: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface CustomExtensionDetailsPageProps {
  disabled: boolean;
  errors: AppErrorFragment[];
  permissions: ShopInfoQuery["shop"]["permissions"] | null | undefined;
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdateMutation["appUpdate"]["app"] | null | undefined;
  token: string;
  hasManagedAppsPermission: boolean;
  isLoading: boolean;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (data: CustomExtensionDetailsPageFormData) => SubmitPromise<AppErrorFragment[]>;
  webhookCreateHref: string;
  onWebhookRemove: (id: string) => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

const CustomExtensionDetailsPage: React.FC<CustomExtensionDetailsPageProps> = props => {
  const {
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    app,
    token,
    hasManagedAppsPermission,
    onTokenClose,
    onTokenCreate,
    onTokenDelete,
    onSubmit,
    webhookCreateHref,
    onWebhookRemove,
    onAppActivateOpen,
    onAppDeactivateOpen,
    onAppDeleteOpen,
    isLoading,
  } = props;
  const intl = useIntl();
  const navigate = useNavigator();
  const webhooks = app?.webhooks || [];
  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppInstallErrorMessage(formErrors.permissions, intl);

  // Ensure all values have safe fallbacks
  const initialForm: CustomExtensionDetailsPageFormData = {
    hasFullAccess:
      Array.isArray(permissions) &&
      Array.isArray(app?.permissions) &&
      permissions.filter(perm => !app?.permissions?.some(userPerm => userPerm.code === perm.code))
        .length === 0,
    isActive: !!app?.isActive,
    name: app?.name || "",
    permissions: app?.permissions?.map(perm => perm.code) || [],
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav
            href={ExtensionsUrls.resolveInstalledExtensionsUrl()}
            title={app?.name || ""}
          ></TopNav>
          <DetailPageLayout.Content>
            <AppHeaderOptions
              isActive={data?.isActive}
              onAppActivateOpen={onAppActivateOpen}
              onAppDeactivateOpen={onAppDeactivateOpen}
              onAppDeleteOpen={onAppDeleteOpen}
            />

            {token && (
              <>
                <CustomExtensionDefaultToken token={token} onTokenClose={onTokenClose} />
                <CardSpacer />
              </>
            )}
            <CustomExtensionInformation
              data={data}
              disabled={disabled || !hasManagedAppsPermission}
              errors={errors || []}
              onChange={change}
            />
            <CardSpacer />

            <CustomExtensionTokens
              tokens={app?.tokens}
              isLoading={isLoading}
              onCreate={onTokenCreate}
              onDelete={onTokenDelete}
              hasManagedAppsPermission={hasManagedAppsPermission}
            />
            <CardSpacer />

            <WebhooksList
              webhooks={webhooks}
              onRemove={onWebhookRemove}
              createHref={app?.isActive ? webhookCreateHref : undefined}
              hasManagedAppsPermission={hasManagedAppsPermission}
            />
            <CardSpacer />
          </DetailPageLayout.Content>
          <DetailPageLayout.RightSidebar>
            <AccountPermissions
              data={data}
              errorMessage={permissionsError}
              disabled={disabled || !hasManagedAppsPermission}
              permissions={permissions || []}
              // TODO: Disable permissions when user has insufficient
              // or show message
              permissionsExceeded={false}
              disabledPermissionsTooltip={
                !hasManagedAppsPermission &&
                intl.formatMessage(appMessages.missingManageAppsPermission)
              }
              onChange={change}
              fullAccessLabel={intl.formatMessage({
                id: "5hFkdO",
                defaultMessage: "Grant this extension full access to the store",
                description: "checkbox label",
              })}
              description={intl.formatMessage({
                id: "GuYTfQ",
                defaultMessage:
                  "Expand or restrict extension permissions to access certain part of Saleor system.",
                description: "card description",
              })}
            />
          </DetailPageLayout.RightSidebar>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton
              onClick={() => navigate(ExtensionsUrls.resolveInstalledExtensionsUrl())}
            />
            <Tooltip>
              <Tooltip.Trigger>
                <div>
                  <Savebar.ConfirmButton
                    transitionState={saveButtonBarState}
                    onClick={submit}
                    disabled={isSaveDisabled || !hasManagedAppsPermission}
                  />
                </div>
              </Tooltip.Trigger>
              {!hasManagedAppsPermission && (
                <Tooltip.Content>
                  <Tooltip.Arrow />
                  <FormattedMessage {...appMessages.missingManageAppsPermission} />
                </Tooltip.Content>
              )}
            </Tooltip>
          </Savebar>
        </DetailPageLayout>
      )}
    </Form>
  );
};

CustomExtensionDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomExtensionDetailsPage;
