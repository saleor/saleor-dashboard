// @ts-strict-ignore
import AppActivateDialog from "@dashboard/apps/components/AppActivateDialog";
import AppDeactivateDialog from "@dashboard/apps/components/AppDeactivateDialog";
import { appMessages } from "@dashboard/apps/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { getApiUrl } from "@dashboard/config";
import TokenCreateDialog from "@dashboard/custom-apps/components/TokenCreateDialog";
import TokenDeleteDialog from "@dashboard/custom-apps/components/TokenDeleteDialog";
import WebhookDeleteDialog from "@dashboard/custom-apps/components/WebhookDeleteDialog";
import { CustomAppUrls } from "@dashboard/custom-apps/urls";
import {
  AppTokenCreateMutation,
  AppTokenDeleteMutation,
  AppUpdateMutation,
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppQuery,
  useAppTokenCreateMutation,
  useAppTokenDeleteMutation,
  useAppUpdateMutation,
  useWebhookDeleteMutation,
  WebhookDeleteMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import useNotifier from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { extractMutationErrors, getStringOrPlaceholder } from "@dashboard/misc";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import CustomAppDetailsPage, {
  CustomAppDetailsPageFormData,
} from "../../components/CustomAppDetailsPage";
import { CustomAppDetailsUrlDialog, CustomAppDetailsUrlQueryParams } from "../../urls";

interface OrderListProps {
  id: string;
  params: CustomAppDetailsUrlQueryParams;
  token: string;
  onTokenClose: () => void;
}

const CustomAppDetails: React.FC<OrderListProps> = ({ id, params, token, onTokenClose }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  React.useEffect(() => onTokenClose, []);

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomAppDetailsUrlDialog,
    CustomAppDetailsUrlQueryParams
  >(navigate, params => CustomAppUrls.resolveAppUrl(id, params), params);
  const { data, loading, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id, hasManagedAppsPermission: true },
  });
  const [activateApp, activateAppResult] = useAppActivateMutation({
    onCompleted: data => {
      const errors = data?.appActivate?.errors;

      if (errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(appMessages.appActivated),
        });
        refetch();
        closeModal();
      } else {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({
    onCompleted: data => {
      const errors = data?.appDeactivate?.errors;

      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(appMessages.appDeactivated),
        });
        refetch();
        closeModal();
      } else {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const onWebhookDelete = (data: WebhookDeleteMutation) => {
    if (data.webhookDelete.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      navigate(CustomAppUrls.resolveAppUrl(id));
      closeModal();
      refetch();
    }
  };
  const [webhookDelete, webhookDeleteOpts] = useWebhookDeleteMutation({
    onCompleted: onWebhookDelete,
  });
  const handleRemoveWebhookConfirm = () => {
    webhookDelete({
      variables: {
        id: params.id,
      },
    });
  };
  const onAppUpdate = (data: AppUpdateMutation) => {
    if (data?.appUpdate?.errors?.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
    }
  };
  const customApp = data?.app;
  const onTokenCreate = (data: AppTokenCreateMutation) => {
    if (data?.appTokenCreate?.errors.length === 0) {
      refetch();
    }
  };
  const onTokenDelete = (data: AppTokenDeleteMutation) => {
    if (data?.appTokenDelete?.errors.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage(commonMessages.savedChanges),
      });
      refetch();
      closeModal();
    }
  };
  const [updateApp, updateAppOpts] = useAppUpdateMutation({
    onCompleted: onAppUpdate,
  });
  const [createToken, createTokenOpts] = useAppTokenCreateMutation({
    onCompleted: onTokenCreate,
  });
  const [deleteToken, deleteTokenOpts] = useAppTokenDeleteMutation({
    onCompleted: onTokenDelete,
  });
  const handleSubmit = async (data: CustomAppDetailsPageFormData) =>
    extractMutationErrors(
      updateApp({
        variables: {
          id,
          input: {
            name: data.name,
            permissions: data.hasFullAccess
              ? shop.permissions.map(permission => permission.code)
              : data.permissions,
          },
        },
      }),
    );
  const handleTokenCreate = (name: string) =>
    createToken({
      variables: {
        input: {
          app: id,
          name,
        },
      },
    });
  const handleTokenDelete = () =>
    deleteToken({
      variables: {
        id: params.id,
      },
    });
  const handleActivateConfirm = () => {
    activateApp({ variables: { id } });
  };
  const handleDeactivateConfirm = () => {
    deactivateApp({ variables: { id } });
  };
  const currentToken = data?.app?.tokens?.find(token => token.id === params.id);

  if (customApp === null) {
    return <NotFoundPage backHref={CustomAppUrls.resolveAppListUrl()} />;
  }

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(customApp?.name)} />
      <CustomAppDetailsPage
        apiUrl={getApiUrl()}
        disabled={loading}
        errors={updateAppOpts.data?.appUpdate?.errors || []}
        token={token}
        onApiUrlClick={() => open(getApiUrl(), "blank")}
        onSubmit={handleSubmit}
        onTokenClose={onTokenClose}
        onTokenCreate={() => openModal("create-token")}
        onTokenDelete={id =>
          openModal("remove-token", {
            id,
          })
        }
        webhookCreateHref={CustomAppUrls.resolveWebhookAddUrl(id)}
        onWebhookRemove={id =>
          openModal("remove-webhook", {
            id,
          })
        }
        onAppActivateOpen={() => openModal("app-activate")}
        onAppDeactivateOpen={() => openModal("app-deactivate")}
        permissions={shop?.permissions}
        app={data?.app}
        saveButtonBarState={updateAppOpts.status}
      />
      <TokenCreateDialog
        confirmButtonState={createTokenOpts.status}
        onClose={closeModal}
        onCreate={handleTokenCreate}
        open={params.action === "create-token"}
        token={createTokenOpts.data?.appTokenCreate.authToken}
      />
      <TokenDeleteDialog
        confirmButtonState={deleteTokenOpts.status}
        name={
          currentToken?.name || currentToken?.authToken ? `**** ${currentToken.authToken}` : "..."
        }
        onClose={closeModal}
        onConfirm={handleTokenDelete}
        open={params.action === "remove-token"}
      />
      <WebhookDeleteDialog
        confirmButtonState={webhookDeleteOpts.status}
        name={data?.app?.webhooks.find(webhook => webhook.id === params.id)?.name}
        onClose={closeModal}
        onConfirm={handleRemoveWebhookConfirm}
        open={params.action === "remove-webhook"}
      />
      <AppActivateDialog
        confirmButtonState={activateAppResult.status}
        name={data?.app.name}
        onClose={closeModal}
        onConfirm={handleActivateConfirm}
        open={params.action === "app-activate"}
      />
      <AppDeactivateDialog
        confirmButtonState={deactivateAppResult.status}
        name={data?.app.name}
        onClose={closeModal}
        onConfirm={handleDeactivateConfirm}
        thirdParty={false}
        open={params.action === "app-deactivate"}
      />
    </>
  );
};

export default CustomAppDetails;
