import { appMessages } from "@saleor/apps/messages";
import NotFoundPage from "@saleor/components/NotFoundPage";
import {
  useAppActivateMutation,
  useAppDeactivateMutation,
  useAppQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import getAppErrorMessage from "@saleor/utils/errors/app";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";
import { useIntl } from "react-intl";

import AppActivateDialog from "../../components/AppActivateDialog";
import AppDeactivateDialog from "../../components/AppDeactivateDialog";
import AppDetailsPage from "../../components/AppDetailsPage";
import {
  appDetailsUrl,
  AppDetailsUrlDialog,
  AppDetailsUrlQueryParams,
  appsListPath,
  appUrl,
} from "../../urls";

interface AppDetailsProps {
  id: string;
  params: AppDetailsUrlQueryParams;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ id, params }) => {
  const { data, loading, refetch } = useAppQuery({
    displayLoader: true,
    variables: { id },
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
        if (appExists) {
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
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage(appMessages.appDeactivated),
        });
        refetch();
        closeModal();
      } else {
        if (appExists) {
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

  const [openModal, closeModal] = createDialogActionHandlers<
    AppDetailsUrlDialog,
    AppDetailsUrlQueryParams
  >(navigate, params => appDetailsUrl(id, params), params);

  const handleActivateConfirm = () => {
    activateApp(mutationOpts);
  };
  const handleDeactivateConfirm = () => {
    deactivateApp(mutationOpts);
  };

  if (!appExists) {
    return <NotFoundPage backHref={appsListPath} />;
  }

  return (
    <>
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
        open={params.action === "app-deactivate"}
      />
      <AppDetailsPage
        data={data?.app}
        loading={loading}
        navigateToApp={() => navigate(appUrl(id))}
        onAppActivateOpen={() => openModal("app-activate")}
        onAppDeactivateOpen={() => openModal("app-deactivate")}
      />
    </>
  );
};

export default AppDetails;
