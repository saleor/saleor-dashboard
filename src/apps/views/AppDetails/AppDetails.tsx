import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React from "react";

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
  const mutationOpts = { variables: { id } };
  const [activateApp, activateAppResult] = useAppActivateMutation({
    onCompleted: data => {
      if (data?.appActivate?.errors.length === 0) {
        refetch();
        closeModal();
      }
    }
  });
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({
    onCompleted: data => {
      if (data?.appDeactivate?.errors.length === 0) {
        refetch();
        closeModal();
      }
    }
  });

  const [openModal, closeModal] = createDialogActionHandlers<
    AppDetailsUrlDialog,
    AppDetailsUrlQueryParams
  >(navigate, params => appUrl(id, params), params);

  const handleActivateConfirm = () => activateApp(mutationOpts);
  const handleDeactivateConfirm = () => deactivateApp(mutationOpts);

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
        onAppActivateOpen={() => openModal("app-activate")}
        onAppDeactivateOpen={() => openModal("app-deactivate")}
        onBack={() => navigate(appsListPath)}
      />
    </>
  );
};

export default AppDetails;
