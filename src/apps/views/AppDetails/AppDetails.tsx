import React, { useEffect } from "react";

import AppDetailsPage from "../../components/AppDetailsPage";
import {
  useAppActivateMutation,
  useAppDeactivateMutation
} from "../../mutations";
import { useAppDetails } from "../../queries";
import { AppListUrlQueryParams } from "../../urls";

interface AppDetailsProps {
  id: string;
  params: AppListUrlQueryParams;
}

export const AppDetails: React.FC<AppDetailsProps> = ({ id }) => {
  const { data, refetch } = useAppDetails({
    displayLoader: true,
    variables: { id }
  });
  const mutationOpts = { variables: { id } };
  const [activateApp, activateAppResult] = useAppActivateMutation({});
  const [deactivateApp, deactivateAppResult] = useAppDeactivateMutation({});

  useEffect(() => {
    const { status, data } = activateAppResult;
    if (status === "success" && data?.appActivate?.appErrors.length === 0) {
      refetch();
    }
  }, [activateAppResult.status]);

  useEffect(() => {
    const { status, data } = deactivateAppResult;
    if (status === "success" && data?.appDeactivate?.appErrors.length === 0) {
      refetch();
    }
  }, [deactivateAppResult.status]);

  return (
    <AppDetailsPage
      data={data?.app}
      onAppActivate={() => activateApp(mutationOpts)}
      onAppDeactivate={() => deactivateApp(mutationOpts)}
    />
  );
};

export default AppDetails;
