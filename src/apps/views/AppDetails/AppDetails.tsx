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
  useAppActivateMutation,
  useAppDeactivateMutation
} from "../../mutations";
import { useAppDetails } from "../../queries";
import {
  AppDetailsUrlDialog,
  AppDetailsUrlQueryParams,
  appSettingsUrl,
  appsListPath,
  appUrl
} from "../../urls";

interface AppDetailsProps {
  id: string;
  params: AppDetailsUrlQueryParams;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ id, params }) => {
  const { data, loading, refetch } = useAppDetails({
    displayLoader: true,
    variables: { id }
  });
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
          text: intl.formatMessage({
            defaultMessage: "App activated",
            description: "snackbar text"
          })
        });
        refetch();
        closeModal();
      } else {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl)
          })
        );
      }
    }
  });
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({
    onCompleted: data => {
      const errors = data?.appDeactivate?.errors;
      if (errors.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            defaultMessage: "App deactivated",
            description: "snackbar text"
          })
        });
        refetch();
        closeModal();
      } else {
        errors.forEach(error =>
          notify({
            status: "error",
            text: getAppErrorMessage(error, intl)
          })
        );
      }
    }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    AppDetailsUrlDialog,
    AppDetailsUrlQueryParams
  >(navigate, params => appUrl(id, params), params);

  const handleActivateConfirm = () => {
    activateApp(mutationOpts);
  };
  const handleDeactivateConfirm = () => {
    deactivateApp(mutationOpts);
  };

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
        navigateToAppSettings={() => navigate(appSettingsUrl(id))}
        onAppActivateOpen={() => openModal("app-activate")}
        onAppDeactivateOpen={() => openModal("app-deactivate")}
        onBack={() => navigate(appsListPath)}
      />
    </>
  );
};

export default AppDetails;
