// @ts-strict-ignore
import activateIcon from "@assets/images/activate-icon.svg";
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import { appMessages } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import {
  AppErrorFragment,
  AppUpdateMutation,
  PermissionEnum,
  ShopInfoQuery,
} from "@dashboard/graphql";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useNavigator from "@dashboard/hooks/useNavigator";
import { getFormErrors } from "@dashboard/utils/errors";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import { Button } from "@saleor/macaw-ui";
import { Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import SVG from "react-inlinesvg";
import { FormattedMessage, useIntl } from "react-intl";

import CustomExtensionDefaultToken from "../CustomExtensionDefaultToken";
import CustomExtensionInformation from "../CustomExtensionInformation";
import CustomExtensionTokens from "../CustomExtensionTokens";
import { WebhooksList } from "../WebhooksList";
import { useStyles } from "./styles";

export interface CustomExtensionDetailsPageFormData {
  hasFullAccess: boolean;
  isActive: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface CustomExtensionDetailsPageProps {
  apiUrl: string;
  disabled: boolean;
  errors: AppErrorFragment[];
  permissions: ShopInfoQuery["shop"]["permissions"] | null | undefined;
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdateMutation["appUpdate"]["app"] | null | undefined;
  token: string;
  hasManagedAppsPermission: boolean;
  onApiUrlClick: () => void;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (data: CustomExtensionDetailsPageFormData) => SubmitPromise<AppErrorFragment[]>;
  webhookCreateHref: string;
  onWebhookRemove: (id: string) => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
}

const CustomExtensionDetailsPage: React.FC<CustomExtensionDetailsPageProps> = props => {
  const {
    apiUrl,
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    app,
    token,
    hasManagedAppsPermission,
    onApiUrlClick,
    onTokenClose,
    onTokenCreate,
    onTokenDelete,
    onSubmit,
    webhookCreateHref,
    onWebhookRemove,
    onAppActivateOpen,
    onAppDeactivateOpen,
  } = props;
  const intl = useIntl();
  const classes = useStyles();
  const navigate = useNavigator();
  const webhooks = app?.webhooks || [];
  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

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
          <TopNav href={ExtensionsUrls.resolveInstalledExtensionsUrl()} title={app?.name || ""}>
            {hasManagedAppsPermission && (
              <Tooltip>
                <Tooltip.Trigger>
                  <Button
                    variant="secondary"
                    className={classes.activateButton}
                    disableFocusRipple
                    onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
                    disabled={disabled}
                  >
                    <SVG src={activateIcon} />
                    {data?.isActive ? (
                      <FormattedMessage
                        id="whTEcF"
                        defaultMessage="Deactivate"
                        description="link"
                      />
                    ) : (
                      <FormattedMessage id="P5twxk" defaultMessage="Activate" description="link" />
                    )}
                  </Button>
                </Tooltip.Trigger>
              </Tooltip>
            )}
          </TopNav>
          <DetailPageLayout.Content>
            {token && (
              <>
                <CustomExtensionDefaultToken
                  apiUrl={apiUrl}
                  token={token}
                  onApiUrlClick={onApiUrlClick}
                  onTokenClose={onTokenClose}
                />
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
              tokens={app?.tokens || []}
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
            <Tooltip>
              <Tooltip.Trigger>
                <div>
                  <AccountPermissions
                    data={data}
                    errorMessage={permissionsError}
                    disabled={disabled || !hasManagedAppsPermission}
                    permissions={permissions || []}
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
                </div>
              </Tooltip.Trigger>
              {!hasManagedAppsPermission && (
                <Tooltip.Content>
                  <Tooltip.Arrow />
                  {appMessages.missingManageAppsPermission}
                </Tooltip.Content>
              )}
            </Tooltip>
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
                  {appMessages.missingManageAppsPermission}
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
