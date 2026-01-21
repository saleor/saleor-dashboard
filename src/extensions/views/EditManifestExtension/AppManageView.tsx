import { useApolloClient } from "@apollo/client";
import NotFoundPage from "@dashboard/components/NotFoundPage";
import { AppActivateDialog } from "@dashboard/extensions/components/AppActivateDialog/AppActivateDialog";
import { AppDeactivateDialog } from "@dashboard/extensions/components/AppDeactivateDialog/AppDeactivateDialog";
import { AppDeleteDialog } from "@dashboard/extensions/components/AppDeleteDialog/AppDeleteDialog";
import { appMessages } from "@dashboard/extensions/messages";
import { EXTENSION_LIST_QUERY } from "@dashboard/extensions/queries";
import {
  AppDetailsUrlDialog,
  AppDetailsUrlQueryParams,
  ExtensionsPaths,
  ExtensionsUrls,
} from "@dashboard/extensions/urls";
import {
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppDeleteMutation,
  useAppQuery,
} from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import getAppErrorMessage from "@dashboard/utils/errors/app";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useIntl } from "react-intl";

import { AppDetailsPage } from "./components/AppDetailsPage/AppDetailsPage";
import { messages } from "./messages";

interface Props {
  id: string;
  params: AppDetailsUrlQueryParams;
}

export const EditManifestExtension = ({ id, params }: Props) => {
  const client = useApolloClient();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { data, loading, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id, hasManagedAppsPermission },
  });
  const appExists = data?.app !== null;
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();
  const mutationOpts = { variables: { id } };
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
        if (appExists && errors) {
          errors.forEach(error =>
            notify({
              status: "error",
              text: getAppErrorMessage(error, intl),
            }),
          );
        }
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
        if (appExists && errors) {
          errors.forEach(error =>
            notify({
              status: "error",
              text: getAppErrorMessage(error, intl),
            }),
          );
        }
      }
    },
  });
  const refetchExtensionList = () => {
    client.refetchQueries({
      include: [EXTENSION_LIST_QUERY],
    });
  };
  const removeAppNotify = () => {
    notify({
      status: "success",
      text: intl.formatMessage(messages.appRemoved),
    });
  };
  const [deleteApp, deleteAppOpts] = useAppDeleteMutation({
    onCompleted: data => {
      if (!data?.appDelete?.errors?.length) {
        refetch();
        refetchExtensionList();
        removeAppNotify();
        navigate(ExtensionsPaths.installedExtensions);
      }
    },
  });
  const [openModal, closeModal] = createDialogActionHandlers<
    AppDetailsUrlDialog,
    AppDetailsUrlQueryParams
  >(navigate, params => ExtensionsUrls.resolveEditManifestExtensionUrl(id, params), params);
  const handleActivateConfirm = () => activateApp(mutationOpts);
  const handleDeactivateConfirm = () => deactivateApp(mutationOpts);
  const handleRemoveConfirm = () => deleteApp({ ...mutationOpts });

  if (!appExists) {
    return <NotFoundPage backHref={ExtensionsUrls.resolveInstalledExtensionsUrl()} />;
  }

  return (
    <>
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
        open={params.action === "app-deactivate"}
      />
      <AppDeleteDialog
        confirmButtonState={deleteAppOpts.status}
        name={data?.app?.name || ""}
        onClose={closeModal}
        onConfirm={handleRemoveConfirm}
        type="EXTERNAL"
        open={params.action === "app-delete"}
      />
      <AppDetailsPage
        data={data?.app || null}
        loading={loading}
        onAppActivateOpen={() => openModal("app-activate")}
        onAppDeactivateOpen={() => openModal("app-deactivate")}
        onAppDeleteOpen={() => openModal("app-delete")}
      />
    </>
  );
};
