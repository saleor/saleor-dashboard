import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { InstalledExtension } from "@dashboard/extensions/types";
import { JobStatusEnum, useAppsInstallationsQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { fuzzySearch } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { Package } from "lucide-react";
import { useEffect, useState } from "react";

import { FailedInstallationActions } from "../components/FailedInstallationActions";
import { FailedInstallationInfo } from "../components/InfoLabels/FailedInstallationInfo";
import { InstallationPendingInfo } from "../components/InfoLabels/InstallationPendingInfo";
import { useActiveAppsInstallations } from "./useActiveAppsInstallations";
import { useInstallationNotify } from "./useInstallationNotify";

interface UsePendingInstallationProps {
  refetchExtensions: () => void;
  onCloseModal: () => void;
  onFailedInstallationRemove: (id: string) => void;
  searchQuery: string;
}

const getPendingInstallationLogo = ({ logo, name }: { logo?: string | null; name: string }) => {
  if (logo) {
    return <Box as="img" src={logo} alt={name} display="block" maxWidth="100%" />;
  }

  return <Package size={iconSize.medium} strokeWidth={iconStrokeWidth} />;
};

export const usePendingInstallation = ({
  refetchExtensions,
  onCloseModal,
  onFailedInstallationRemove,
  searchQuery,
}: UsePendingInstallationProps) => {
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  // Don't display loading when user doesn't have permissions
  // we don't fetch installations in that case
  const [initialLoading, setInitialLoading] = useState(hasManagedAppsPermission);
  const { data, loading, refetch } = useAppsInstallationsQuery({
    displayLoader: true,
    skip: !hasManagedAppsPermission,
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
        logo: getPendingInstallationLogo({ logo: brand?.logo?.default, name: appName }),
        info: isFailed ? <FailedInstallationInfo /> : <InstallationPendingInfo />,
        actions: isFailed ? (
          <FailedInstallationActions
            onDelete={() => onFailedInstallationRemove(id)}
            onRetry={() => handleAppInstallRetry(id)}
          />
        ) : null,
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
