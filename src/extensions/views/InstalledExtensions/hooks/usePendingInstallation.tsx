import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { infoMessages } from "@dashboard/extensions/messages";
import { type InstalledExtension } from "@dashboard/extensions/types";
import { JobStatusEnum, useAppsInstallationsQuery } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import { useHasManageStaffPermission } from "@dashboard/hooks/useHasManageStaffPermission";
import { fuzzySearch, getUserName } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { Package, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";

import { FailedInstallationActions } from "../components/FailedInstallationActions";
import { FailedInstallationInfo } from "../components/InfoLabels/FailedInstallationInfo";
import { InfoLabelsContainer } from "../components/InfoLabels/InfoLabelsContainer";
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
  const { hasManageStaffPermission } = useHasManageStaffPermission();

  // Don't display loading when user doesn't have permissions
  // we don't fetch installations in that case
  const [initialLoading, setInitialLoading] = useState(hasManagedAppsPermission);
  const { data, loading, refetch } = useAppsInstallationsQuery({
    displayLoader: true,
    skip: !hasManagedAppsPermission,
    variables: { hasManageStaffPermission },
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
    ({ status, id, appName, brand, installedBy }) => {
      const isFailed = status === JobStatusEnum.FAILED;
      const installerName = getUserName(installedBy);

      return {
        id: id,
        name: appName,
        logo: getPendingInstallationLogo({ logo: brand?.logo?.default, name: appName }),
        info: (
          <Box display="flex" alignItems="center" gap={4}>
            {isFailed ? <FailedInstallationInfo /> : <InstallationPendingInfo />}
            {installerName && (
              <InfoLabelsContainer
                icon={<UserRound size={iconSize.small} strokeWidth={iconStrokeWidth} />}
                message={
                  <FormattedMessage
                    {...infoMessages.installationRequestedBy}
                    values={{ user: installerName }}
                  />
                }
              />
            )}
          </Box>
        ),
        actions: isFailed ? (
          <FailedInstallationActions
            onDelete={() => onFailedInstallationRemove(id)}
            onRetry={() => handleAppInstallRetry(id)}
          />
        ) : null,
        activeProblemCount: 0,
        criticalProblemCount: 0,
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
