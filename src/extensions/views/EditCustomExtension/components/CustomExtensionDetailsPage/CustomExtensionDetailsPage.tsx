// @ts-strict-ignore
import activateIcon from "@assets/images/activate-icon.svg";
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
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
  permissions: ShopInfoQuery["shop"]["permissions"];
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdateMutation["appUpdate"]["app"];
  token: string;
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
  const webhooks = app?.webhooks;
  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);
  const initialForm: CustomExtensionDetailsPageFormData = {
    hasFullAccess:
      permissions?.filter(
        perm => app?.permissions?.filter(userPerm => userPerm.code === perm.code).length === 0,
      ).length === 0 || false,
    isActive: !!app?.isActive,
    name: app?.name || "",
    permissions: app?.permissions?.map(perm => perm.code) || [],
  };

  return (
    <Form confirmLeave initial={initialForm} onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, submit, isSaveDisabled }) => (
        <DetailPageLayout>
          <TopNav href={ExtensionsUrls.resolveInstalledExtensionsUrl()} title={app?.name}>
            <Button
              variant="secondary"
              className={classes.activateButton}
              disableFocusRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <SVG src={activateIcon} />
              {data?.isActive ? (
                <FormattedMessage id="whTEcF" defaultMessage="Deactivate" description="link" />
              ) : (
                <FormattedMessage id="P5twxk" defaultMessage="Activate" description="link" />
              )}
            </Button>
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
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <CardSpacer />
            <CustomExtensionTokens
              tokens={app?.tokens}
              onCreate={onTokenCreate}
              onDelete={onTokenDelete}
            />
            <CardSpacer />
            <WebhooksList
              webhooks={webhooks}
              onRemove={onWebhookRemove}
              createHref={app?.isActive && webhookCreateHref}
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
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton
              onClick={() => navigate(ExtensionsUrls.resolveInstalledExtensionsUrl())}
            />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </Form>
  );
};

CustomExtensionDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomExtensionDetailsPage;
