import AccountPermissions from "@saleor/components/AccountPermissions";
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
  ShopInfoQuery
} from "@saleor/graphql";
import { SubmitPromise } from "@saleor/hooks/useForm";
import { sectionNames } from "@saleor/intl";
import {
  Backlink,
  Button,
  ConfirmButtonTransitionState
} from "@saleor/macaw-ui";
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
  onBack: () => void;
  onTokenDelete: (id: string) => void;
  onTokenClose: () => void;
  onTokenCreate: () => void;
  onSubmit: (
    data: CustomAppDetailsPageFormData
  ) => SubmitPromise<AppErrorFragment[]>;
  onWebhookCreate: () => void;
  onWebhookRemove: (id: string) => void;
  navigateToWebhookDetails: (id: string) => () => void;
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
    navigateToWebhookDetails,
    token,
    onApiUriClick,
    onBack,
    onTokenClose,
    onTokenCreate,
    onTokenDelete,
    onSubmit,
    onWebhookCreate,
    onWebhookRemove,
    onAppActivateOpen,
    onAppDeactivateOpen
  } = props;
  const intl = useIntl();
  const classes = useStyles({});

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
    <Form
      confirmLeave
      initial={initialForm}
      onSubmit={onSubmit}
      disabled={disabled}
    >
      {({ data, change, submit, isSaveDisabled }) => (
        <Container>
          <Backlink onClick={onBack}>
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
                  defaultMessage="Deactivate"
                  description="link"
                />
              ) : (
                <FormattedMessage
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
            </div>
          </Grid>
          <Savebar
            disabled={isSaveDisabled}
            state={saveButtonBarState}
            onCancel={onBack}
            onSubmit={submit}
          />
        </Container>
      )}
    </Form>
  );
};

CustomAppDetailsPage.displayName = "CustomAppDetailsPage";
export default CustomAppDetailsPage;
