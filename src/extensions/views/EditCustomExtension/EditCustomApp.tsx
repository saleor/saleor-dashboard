// @ts-strict-ignore
import { useApolloClient } from "@apollo/client";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { WindowTitle } from "@dashboard/components/WindowTitle";
import { AppActivateDialog } from "@dashboard/extensions/components/AppActivateDialog/AppActivateDialog";
import { AppDeactivateDialog } from "@dashboard/extensions/components/AppDeactivateDialog/AppDeactivateDialog";
import { AppDeleteDialog } from "@dashboard/extensions/components/AppDeleteDialog/AppDeleteDialog";
import { appMessages, notifyMessages } from "@dashboard/extensions/messages";
import { EXTENSION_LIST_QUERY } from "@dashboard/extensions/queries";
import { getAppInstallErrorMessage, getCustomAppErrorMessage } from "@dashboard/extensions/utils";
import {
  AppTokenCreateMutation,
  AppTokenDeleteMutation,
  AppUpdateMutation,
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppDeleteMutation,
  useAppQuery,
  useAppTokenCreateMutation,
  useAppTokenDeleteMutation,
  useAppUpdateMutation,
  useWebhookDeleteMutation,
  WebhookDeleteMutation,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import useShop from "@dashboard/hooks/useShop";
import { extractMutationErrors, getStringOrPlaceholder, parseLogMessage } from "@dashboard/misc";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useEffect } from "react";
import { useIntl } from "react-intl";

import {
  CustomExtensionDetailsUrlDialog,
  CustomExtensionDetailsUrlQueryParams,
  ExtensionsUrls,
} from "../../urls";
import {
  CustomExtensionDetailsPage,
  CustomExtensionDetailsPageFormData,
} from "./components/CustomExtensionDetailsPage/CustomExtensionDetailsPage";
import { TokenCreateDialog } from "./components/TokenCreateDialog/TokenCreateDialog";
import { TokenDeleteDialog } from "./components/TokenDeleteDialog/TokenDeleteDialog";
import { WebhookDeleteDialog } from "./components/WebhookDeleteDialog/WebhookDeleteDialog";

interface OrderListProps {
  id: string;
  params: CustomExtensionDetailsUrlQueryParams;
  token: string;
  onTokenClose: () => void;
}

export const EditCustomExtension = ({ id, params, token, onTokenClose }: OrderListProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const shop = useShop();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  useEffect(() => onTokenClose, []);

  const [openModal, closeModal] = createDialogActionHandlers<
    CustomExtensionDetailsUrlDialog,
    CustomExtensionDetailsUrlQueryParams
  >(navigate, params => ExtensionsUrls.editCustomExtensionUrl(id, params), params);
  const { data, loading, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id, hasManagedAppsPermission },
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
        errors?.forEach(error =>
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

      if (errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(appMessages.appDeactivated),
        });
        refetch();
        closeModal();
      } else {
        errors?.forEach(error =>
          notify({
            status: "error",
            text: getAppInstallErrorMessage(error, intl),
          }),
        );
      }
    },
  });
  const client = useApolloClient();

  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };

  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      if (!data?.appDelete?.errors?.length) {
        refetchExtensionList();
        notify({
          status: "success",
          text: intl.formatMessage(notifyMessages.extensionRemoved),
        });
        navigate(ExtensionsUrls.resolveInstalledExtensionsUrl());
      }
    },
  });

  const handleRemoveConfirm = () =>
    deleteApp({
      variables: {
        id,
      },
    });

  const onWebhookDelete = (data: WebhookDeleteMutation) => {
    if (data?.webhookDelete?.errors?.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({ id: "gOiREw", defaultMessage: "App settings updated" }),
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
        text: intl.formatMessage({ id: "gOiREw", defaultMessage: "App settings updated" }),
      });
    } else {
      const error = data?.appUpdate?.errors[0];

      notify({
        status: "error",
        text: getCustomAppErrorMessage(error, intl),
        apiMessage: parseLogMessage({
          intl,
          code: error.code,
          field: error.field,
        }),
      });
    }
  };
  const customApp = data?.app;
  const onTokenCreate = (data: AppTokenCreateMutation) => {
    if (data?.appTokenCreate?.errors?.length === 0) {
      refetch();
    }
  };
  const onTokenDelete = (data: AppTokenDeleteMutation) => {
    if (data?.appTokenDelete?.errors?.length === 0) {
      notify({
        status: "success",
        text: intl.formatMessage({ id: "gOiREw", defaultMessage: "App settings updated" }),
      });
      refetch();
      closeModal();
    }
  };
  const [updateApp, updateAppOpts] = useAppUpdateMutation({
    onCompleted: onAppUpdate,
    disableErrorHandling: true,
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
            permissions:
              data.hasFullAccess && shop?.permissions
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
        disabled={loading}
        errors={updateAppOpts.data?.appUpdate?.errors || []}
        token={token}
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
        onAppDeleteOpen={() => openModal("app-delete")}
        permissions={shop?.permissions || []}
        app={data?.app}
        saveButtonBarState={updateAppOpts.status}
        hasManagedAppsPermission={hasManagedAppsPermission}
        isLoading={loading}
      />
      <TokenCreateDialog
        confirmButtonState={createTokenOpts.status}
        onClose={closeModal}
        onCreate={handleTokenCreate}
        open={params.action === "create-token"}
        token={createTokenOpts.data?.appTokenCreate?.authToken || ""}
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
        name={data?.app?.webhooks?.find(webhook => webhook.id === params.id)?.name || ""}
        onClose={closeModal}
        onConfirm={handleRemoveWebhookConfirm}
        open={params.action === "remove-webhook"}
      />
      <AppActivateDialog
        confirmButtonState={activateAppResult.status}
        name={data?.app?.name || ""}
        onClose={closeModal}
        onConfirm={handleActivateConfirm}
        open={params.action === "app-activate"}
      />
      <AppDeactivateDialog
        confirmButtonState={deactivateAppResult.status}
        name={data?.app?.name || ""}
        onClose={closeModal}
        onConfirm={handleDeactivateConfirm}
        thirdParty={false}
        open={params.action === "app-deactivate"}
      />
      <AppDeleteDialog
        confirmButtonState={deleteAppOpts.status}
        name={data?.app?.name || ""}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
        type="CUSTOM"
        open={params.action === "app-delete"}
      />
    </>
  );
};
