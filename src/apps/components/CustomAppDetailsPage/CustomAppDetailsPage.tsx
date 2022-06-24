import { appsListUrl } from "@saleor/apps/urls";
import AccountPermissions from "@saleor/components/AccountPermissions";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  AppErrorFragment,
  AppUpdateMutation,
  PermissionEnum,
  ShopInfoQuery,
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useNavigator from "@saleor/hooks/useNavigator";
import { sectionNames } from "@saleor/intl";
import { Button, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getAppErrorMessage from "@saleor/utils/errors/app";
import WebhooksList from "@saleor/webhooks/components/WebhooksList";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import activateIcon from "../../../../assets/images/activate-icon.svg";
import { useStyles } from "../../styles";
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
  permissions: ShopInfoQuery["shop"]["permissions"];
  saveButtonBarState: ConfirmButtonTransitionState;
  app: AppUpdateMutation["appUpdate"]["app"];
  token: string;
  onApiUriClick: () => void;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (
    data: CustomAppDetailsPageFormData,
  ) => SubmitPromise<AppErrorFragment[]>;
  webhookCreateHref: string;
  onWebhookRemove: (id: string) => void;
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
}

const CustomAppDetailsPage: React.FC<CustomAppDetailsPageProps> = props => {
  const {
    apiUri,
    disabled,
    errors,
    permissions,
    saveButtonBarState,
    app,
    token,
    onApiUriClick,
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
  const classes = useStyles({});
  const navigate = useNavigator();

  const webhooks = app?.webhooks;

  const formErrors = getFormErrors(["permissions"], errors || []);
  const permissionsError = getAppErrorMessage(formErrors.permissions, intl);

  const initialForm: CustomAppDetailsPageFormData = {
    hasFullAccess:
      permissions?.filter(
        perm =>
          app?.permissions?.filter(userPerm => userPerm.code === perm.code)
            .length === 0,
      ).length === 0 || false,
    isActive: !!app?.isActive,
    name: app?.name || "",
    permissions: app?.permissions?.map(perm => perm.code) || [],
  };

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
          <PageHeader title={app?.name}>
            <Button
              variant="secondary"
              className={classes.activateButton}
              disableFocusRipple
              onClick={data.isActive ? onAppDeactivateOpen : onAppActivateOpen}
            >
              <img src={activateIcon} alt="" />
              {data?.isActive ? (
                <FormattedMessage
                  id="whTEcF"
                  defaultMessage="Deactivate"
                  description="link"
                />
              ) : (
                <FormattedMessage
                  id="P5twxk"
                  defaultMessage="Activate"
                  description="link"
                />
              )}
            </Button>
          </PageHeader>
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
                createHref={app?.isActive && webhookCreateHref}
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

CustomAppDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomAppDetailsPage;
