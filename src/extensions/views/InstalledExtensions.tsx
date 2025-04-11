import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import {
  ExtensionsListUrlDialog,
  ExtensionsListUrlQueryParams,
  ExtensionsUrls,
} from "@dashboard/extensions/urls";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";

import { DeleteFailedInstallationDialog } from "../components/DeleteFailedInstallationDialog";
import { InstalledExtensionsList } from "../components/InstalledExtensionsList";
import { RequestExtensionsButton } from "../components/RequestExtensionsButton";
import { useInstalledExtensionsData } from "../hooks/useInstalledExtensionsData";
import { usePendingInstallation } from "../hooks/usePendingInstallation";
import { headerTitles, messages } from "../messages";

interface InstalledExtensionsProps {
  params: ExtensionsListUrlQueryParams;
}

export const InstalledExtensions = ({ params }: InstalledExtensionsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [query, setQuery] = useState("");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  const [openModal, closeModal] = createDialogActionHandlers<
    ExtensionsListUrlDialog,
    ExtensionsListUrlQueryParams
  >(navigate, ExtensionsUrls.resolveInstalledExtensionsUrl, {});

  const handleRemoveFailedInstallation = (id: string) => {
    openModal("app-installation-remove", { id });
  };

  const { installedApps, installedAppsLoading, refetchInstalledApps } = useInstalledExtensionsData({
    searchQuery: query,
  });

  const {
    pendingInstallations,
    deleteInProgressAppStatus,
    pendingInstallationsLoading,
    handleRemoveInProgress,
  } = usePendingInstallation({
    searchQuery: query,
    onCloseModal: closeModal,
    refetchExtensions: refetchInstalledApps,
    onFailedInstallationRemove: handleRemoveFailedInstallation,
  });

  return (
    <>
      <TopNav title={intl.formatMessage(headerTitles.installedExtensions)}>
        <Box display="flex" gap={4} alignItems="center">
          <RequestExtensionsButton />
          {hasManagedAppsPermission && (
            <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
          )}
        </Box>
      </TopNav>
      <Box paddingX={6}>
        <Box __width="370px" marginTop={8} marginBottom={12}>
          <SearchInput
            withBorder
            size="medium"
            initialSearch={query}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onSearchChange={newQuery => setQuery(newQuery)}
          />
        </Box>

        <InstalledExtensionsList
          installedExtensions={[...pendingInstallations, ...installedApps]}
          loading={pendingInstallationsLoading || installedAppsLoading}
          clearSearch={() => setQuery("")}
        />

        <DeleteFailedInstallationDialog
          confirmButtonState={deleteInProgressAppStatus}
          name={pendingInstallations.find(installation => installation.id === params?.id)?.name}
          onClose={closeModal}
          onConfirm={() => handleRemoveInProgress(params?.id || "")}
          open={params.action === "app-installation-remove"}
        />
      </Box>
    </>
  );
};
