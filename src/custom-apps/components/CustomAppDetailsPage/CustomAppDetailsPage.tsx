// @ts-strict-ignore
import AccountPermissions from "@dashboard/components/AccountPermissions";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import CardSpacer from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Savebar } from "@dashboard/components/Savebar";
import WebhooksList from "@dashboard/custom-apps/components/WebhooksList";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
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
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomAppDefaultToken from "../CustomAppDefaultToken";
import CustomAppInformation from "../CustomAppInformation";
import CustomAppTokens from "../CustomAppTokens";
import { useStyles } from "./styles";

export interface CustomAppDetailsPageFormData {
  hasFullAccess: boolean;
  isActive: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface CustomAppDetailsPageProps {
  disabled: boolean;
  errors: AppErrorFragment[];
  permissions: ShopInfoQuery["shop"]["permissions"];
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdateMutation["appUpdate"]["app"];
  token: string;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (data: CustomAppDetailsPageFormData) => SubmitPromise<AppErrorFragment[]>;
  webhookCreateHref: string;
  onWebhookRemove: (id: string) => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
}

const CustomAppDetailsPage: React.FC<CustomAppDetailsPageProps> = props => {
  const {
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    app,
    token,
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
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions");
  const navigate = useNavigator();
  const webhooks = app?.webhooks;
  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);
  const initialForm: CustomAppDetailsPageFormData = {
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
          <TopNav
            href={
              isExtensionsDevEnabled
                ? ExtensionsUrls.resolveInstalledExtensionsUrl()
                : CustomAppUrls.resolveAppListUrl()
            }
            title={app?.name}
          >
            <Button
              variant="secondary"
              className={classes.activateButton}
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
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
                <CustomAppDefaultToken token={token} onTokenClose={onTokenClose} />
                <CardSpacer />
              </>
            )}
            <CustomAppInformation
              data={data}
              disabled={disabled}
              errors={errors}
              onChange={change}
            />
            <CardSpacer />
            <CustomAppTokens
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
            <Savebar.CancelButton onClick={() => navigate(CustomAppUrls.resolveAppListUrl())} />
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

CustomAppDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomAppDetailsPage;
