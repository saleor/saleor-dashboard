import useActiveAppsInstallations from "@dashboard/extensions/hooks/useActiveAppsInstallations";
import { useInstallationNotify } from "@dashboard/extensions/hooks/useInstallationNotify";
import { InstalledExtension } from "@dashboard/extensions/types";
import { JobStatusEnum, useAppsInstallationsQuery } from "@dashboard/graphql";
import React, { useEffect, useState } from "react";

import { FailedInstallationActions } from "../components/FailedInstallationActions";
import { FailedInstallationInfo } from "../components/FailedInstallationInfo";
import { InstallationPendingInfo } from "../components/InstallationPendingInfo";
import { ViewDetailsActionButton } from "../components/ViewDetailsActionButton";

export const usePendingInstallation = ({
  refetchExtensions,
  onCloseModal,
  onFailedInstallationRemove,
}: {
  refetchExtensions: () => void;
  onCloseModal: () => void;
  onFailedInstallationRemove: (id: string) => void;
}) => {
  const [initialLoading, setInitialLoading] = useState(true);
  const { data, loading, refetch } = useAppsInstallationsQuery();
  const { installedNotify, removeInProgressAppNotify, errorNotify } = useInstallationNotify();

  useEffect(() => {
    if (initialLoading && data) {
      setInitialLoading(false);
    }
  }, [data]);

  const { handleRemoveInProgress, deleteInProgressAppOpts, handleAppInstallRetry } =
    useActiveAppsInstallations({
      appsInProgressData: data?.appsInstallations as any,
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

  const pendingInstallations: InstalledExtension[] =
    data?.appsInstallations.map(({ status, id, appName, brand }) => {
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
    }) ?? [];

  return {
    pendingInstallations,
    pendingInstallationsLoading: initialLoading,
    handleRemoveInProgress,
    deleteInProgressAppStatus: deleteInProgressAppOpts.status,
  };
};
