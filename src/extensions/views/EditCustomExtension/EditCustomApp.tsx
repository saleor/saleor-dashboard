// @ts-strict-ignore
import AppActivateDialog from "@dashboard/apps/components/AppActivateDialog";
import AppDeactivateDialog from "@dashboard/apps/components/AppDeactivateDialog";
import { appMessages } from "@dashboard/apps/messages";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { getApiUrl } from "@dashboard/config";
import { getAppInstallErrorMessage } from "@dashboard/extensions/utils";
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
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  CustomExtensionDetailsUrlDialog,
  CustomExtensionDetailsUrlQueryParams,
  ExtensionsUrls,
} from "../../urls";
import CustomExtensionDetailsPage, {
  CustomExtensionDetailsPageFormData,
} from "./components/CustomExtensionDetailsPage";
import TokenCreateDialog from "./components/TokenCreateDialog";
import TokenDeleteDialog from "./components/TokenDeleteDialog";
import WebhookDeleteDialog from "./components/WebhookDeleteDialog";

interface OrderListProps {
  id: string;
  params: CustomExtensionDetailsUrlQueryParams;
  token: string;
  onTokenClose: () => void;
}

export const EditCustomExtension: React.FC<OrderListProps> = ({
  id,
  params,
  token,
  onTokenClose,
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();

  useEffect(() => onTokenClose, []);

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomExtensionDetailsUrlDialog,
    CustomExtensionDetailsUrlQueryParams
  >(navigate, params => ExtensionsUrls.editCustomExtensionUrl(id, params), params);
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
            text: getAppInstallErrorMessage(error, intl),
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
            text: getAppInstallErrorMessage(error, intl),
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
      navigate(ExtensionsUrls.editCustomExtensionUrl(id));
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
  const handleSubmit = async (data: CustomExtensionDetailsPageFormData) =>
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
    return <NotFoundPage backHref={ExtensionsUrls.resolveInstalledExtensionsUrl()} />;
  }

  return (
    <>
      <WindowTitle title={getStringOrPlaceholder(customApp?.name)} />
      <CustomExtensionDetailsPage
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
        webhookCreateHref={ExtensionsUrls.resolveAddCustomExtensionWebhookUrl(id)}
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
