import AccountPermissions from "@saleor/components/AccountPermissions";
import AppHeader from "@saleor/components/AppHeader";
import AppStatus from "@saleor/components/AppStatus";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ShopInfo_shop_permissions } from "@saleor/components/Shop/types/ShopInfo";
import { AppErrorFragment } from "@saleor/fragments/types/AppErrorFragment";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import { PermissionEnum } from "@saleor/types/globalTypes";
import { getFormErrors } from "@saleor/utils/errors";
import getAppErrorMessage from "@saleor/utils/errors/app";
import WebhooksList from "@saleor/webhooks/components/WebhooksList";
import React from "react";
import { useIntl } from "react-intl";

import { AppUpdate_appUpdate_app } from "../../types/AppUpdate";
import CustomAppDefaultToken from "../CustomAppDefaultToken";
import CustomAppInformation from "../CustomAppInformation";
import CustomAppTokens from "../CustomAppTokens";

export interface CustomAppDetailsPageFormData {
  hasFullAccess: boolean;
  isActive: boolean;
  name: string;
  permissions: PermissionEnum[];
}
export interface CustomAppDetailsPageProps {
  apiUri: string;
  disabled: boolean;
  errors: AppErrorFragment[];
  permissions: ShopInfo_shop_permissions[];
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdate_appUpdate_app;
  token: string;
  onApiUriClick: () => void;
  onBack: () => void;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (data: CustomAppDetailsPageFormData) => SubmitPromise;
  onWebhookCreate: () => void;
  onWebhookRemove: (id: string) => void;
  navigateToWebhookDetails: (id: string) => () => void;
}

const CustomAppDetailsPage: React.FC<CustomAppDetailsPageProps> = props => {
  const {
    apiUri,
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    app,
    navigateToWebhookDetails,
    token,
    onApiUriClick,
    onBack,
    onTokenClose,
    onTokenCreate,
    onTokenDelete,
    onSubmit,
    onWebhookCreate,
    onWebhookRemove
  } = props;
  const intl = useIntl();

  const webhooks = app?.webhooks;

  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

  const initialForm: CustomAppDetailsPageFormData = {
    hasFullAccess:
      permissions?.filter(
        perm =>
          app?.permissions?.filter(userPerm => userPerm.code === perm.code)
            .length === 0
      ).length === 0 || false,
    isActive: !!app?.isActive,
    name: app?.name || "",
    permissions: app?.permissions?.map(perm => perm.code) || []
  };

  return (
    <Form initial={initialForm} onSubmit={onSubmit} confirmLeave>
      {({ data, change, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>
            {intl.formatMessage(sectionNames.apps)}
          </AppHeader>
          <PageHeader title={app?.name} />
          <Grid>
            <div>
              {token && (
                <>
                  <CustomAppDefaultToken
                    apiUri={apiUri}
                    token={token}
                    onApiUriClick={onApiUriClick}
                    onTokenClose={onTokenClose}
                  />
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
                onRowClick={navigateToWebhookDetails}
                onCreate={app?.isActive && onWebhookCreate}
              />
            </div>
            <div>
              <AccountPermissions
                data={data}
                errorMessage={permissionsError}
                disabled={disabled}
                permissions={permissions}
                permissionsExceeded={false}
                onChange={change}
                fullAccessLabel={intl.formatMessage({
                  defaultMessage: "Grant this app full access to the store",
                  description: "checkbox label"
                })}
                description={intl.formatMessage({
                  defaultMessage:
                    "Expand or restrict app permissions to access certain part of Saleor system.",
                  description: "card description"
                })}
              />
              <CardSpacer />
              <AppStatus
                data={data}
                disabled={disabled}
                label={intl.formatMessage({
                  defaultMessage: "App is active",
                  description: "checkbox label"
                })}
                onChange={change}
              />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !hasChanged}
            state={saveButtonBarState}
            onCancel={onBack}
            onSave={submit}
          />
        </Container>
      )}
    </Form>
  );
};

CustomAppDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomAppDetailsPage;
