import { InstalledExtension } from "@dashboard/extensions/types";
import { JobStatusEnum, useAppsInstallationsQuery } from "@dashboard/graphql";
import { fuzzySearch } from "@dashboard/misc";
import React, { useEffect, useState } from "react";

import { FailedInstallationActions } from "../components/FailedInstallationActions";
import { FailedInstallationInfo } from "../components/InfoLabels/FailedInstallationInfo";
import { InstallationPendingInfo } from "../components/InfoLabels/InstallationPendingInfo";
import { ViewDetailsActionButton } from "../components/ViewDetailsActionButton";
import useActiveAppsInstallations from "./useActiveAppsInstallations";
import { useInstallationNotify } from "./useInstallationNotify";

interface UsePendingInstallationProps {
  refetchExtensions: () => void;
  onCloseModal: () => void;
  onFailedInstallationRemove: (id: string) => void;
  searchQuery: string;
}

export const usePendingInstallation = ({
  refetchExtensions,
  onCloseModal,
  onFailedInstallationRemove,
  searchQuery,
}: UsePendingInstallationProps) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { data, loading, refetch } = useAppsInstallationsQuery({
    displayLoader: true,
  });
  const { installedNotify, removeInProgressAppNotify, errorNotify } = useInstallationNotify();

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
    }
  }, [data]);

  const { handleRemoveInProgress, deleteInProgressAppOpts, handleAppInstallRetry } =
    useActiveAppsInstallations({
      appsInProgressData: data,
      appInProgressLoading: loading,
      appsInProgressRefetch: refetch,
      appsRefetch: refetchExtensions,
      installedAppNotify: installedNotify,
      removeInProgressAppNotify,
      onInstallSuccess: () => {
        refetchExtensions();
        refetch();
      },
      onInstallError: item => errorNotify(item.message ?? "", item.appName),
      onRemoveInProgressAppSuccess: onCloseModal,
    });

  const filteredPendingInstallations = fuzzySearch(data?.appsInstallations ?? [], searchQuery, [
    "appName",
  ]);
  const pendingInstallations: InstalledExtension[] = filteredPendingInstallations.map(
    ({ status, id, appName, brand }) => {
      const isFailed = status === JobStatusEnum.FAILED;

      return {
        id: id,
        name: appName,
        logo: brand?.logo?.default ?? "",
        info: isFailed ? <FailedInstallationInfo /> : <InstallationPendingInfo />,
        actions: isFailed ? (
          <FailedInstallationActions
            onDelete={() => onFailedInstallationRemove(id)}
            onRetry={() => handleAppInstallRetry(id)}
          />
        ) : (
          <ViewDetailsActionButton />
        ),
      };
    },
  );

  return {
    pendingInstallations,
    pendingInstallationsLoading: initialLoading,
    handleRemoveInProgress,
    deleteInProgressAppStatus: deleteInProgressAppOpts.status,
  };
};
