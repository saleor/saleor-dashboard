import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { useEffect } from "react";

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
  const [activateApp, activateAppResult] = useAppActivateMutation({});
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({});

  const [openActivateModal, closeActivateModal] = createDialogActionHandlers<
    AppDetailsUrlDialog,
    AppDetailsUrlQueryParams
  >(navigate, params => appUrl(id, params), params);

  const [
    openDeactivateModal,
    closeDeactivateModal
  ] = createDialogActionHandlers<AppDetailsUrlDialog, AppDetailsUrlQueryParams>(
    navigate,
    params => appUrl(id, params),
    params
  );

  useEffect(() => {
    const { status, data } = activateAppResult;
    if (status === "success" && data?.appActivate?.errors.length === 0) {
      refetch();
      closeActivateModal();
    }
  }, [activateAppResult.status]);

  useEffect(() => {
    const { status, data } = deactivateAppResult;
    if (status === "success" && data?.appDeactivate?.errors.length === 0) {
      refetch();
      closeDeactivateModal();
    }
  }, [deactivateAppResult.status]);

  const handleActivateConfirm = () => activateApp(mutationOpts);
  const handleDeactivateConfirm = () => deactivateApp(mutationOpts);

  return (
    <>
      <AppActivateDialog
        confirmButtonState={activateAppResult.status}
        name={data?.app.name}
        onClose={closeActivateModal}
        onConfirm={handleActivateConfirm}
        open={params.action === "app-activate"}
      />
      <AppDeactivateDialog
        confirmButtonState={deactivateAppResult.status}
        name={data?.app.name}
        onClose={closeDeactivateModal}
        onConfirm={handleDeactivateConfirm}
        open={params.action === "app-deactivate"}
      />
      <AppDetailsPage
        data={data?.app}
        loading={loading}
        onAppActivateOpen={() => openActivateModal("app-activate")}
        onAppDeactivateOpen={() => openDeactivateModal("app-deactivate")}
      />
    </>
  );
};

export default AppDetails;
