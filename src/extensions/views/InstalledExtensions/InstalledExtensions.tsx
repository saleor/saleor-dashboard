import { TopNav } from "@dashboard/components/AppLayout";
import { useContextualLink } from "@dashboard/components/AppLayout/ContextualLinks/useContextualLink";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import {
  ExtensionsListUrlDialog,
  ExtensionsListUrlQueryParams,
  ExtensionsUrls,
} from "@dashboard/extensions/urls";
import { useInstalledExtensionsFilter } from "@dashboard/extensions/views/InstalledExtensions/hooks/useInstalledExtensionsFilter";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { Box, ChevronRightIcon, Text } from "@saleor/macaw-ui-next";
import React, { useEffect } from "react";
import { useIntl } from "react-intl";

import { AddExtensionDropdown } from "./components/AddExtensionDropdown";
import { DeleteFailedInstallationDialog } from "./components/DeleteFailedInstallationDialog";
import { InstalledExtensionsList } from "./components/InstalledExtensionsList";
import { useInstalledExtensions } from "./hooks/useInstalledExtensions";
import { usePendingInstallation } from "./hooks/usePendingInstallation";

export interface InstalledExtensionsProps {
  params: ExtensionsListUrlQueryParams;
}

export const InstalledExtensions = ({ params }: InstalledExtensionsProps) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const { markOnboardingStepAsCompleted } = useOnboarding();
  const subtitle = useContextualLink("extensions");

  useEffect(() => {
    markOnboardingStepAsCompleted("view-extensions");
  }, [markOnboardingStepAsCompleted]);

  const [openModal, closeModal] = createDialogActionHandlers<
    ExtensionsListUrlDialog,
    ExtensionsListUrlQueryParams
  >(navigate, ExtensionsUrls.resolveInstalledExtensionsUrl, {});

  const handleRemoveFailedInstallation = (id: string) => {
    openModal("app-installation-remove", { id });
  };

  const { installedExtensions, installedAppsLoading, refetchInstalledApps } =
    useInstalledExtensions();
  const { query, handleQueryChange, filteredInstalledExtensions } =
    useInstalledExtensionsFilter(installedExtensions);

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
    <ListPageLayout>
      <TopNav
        withoutBorder
        isAlignToRight={false}
        title={intl.formatMessage(headerTitles.extensions)}
        subtitle={subtitle}
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box marginX={3} display="flex" alignItems="center">
              <ChevronRightIcon />
            </Box>
            <Text size={6}>{intl.formatMessage(headerTitles.installedExtensions)}</Text>
          </Box>
        </Box>
        <Box display="flex" gap={4} alignItems="center">
          {hasManagedAppsPermission && <AddExtensionDropdown />}
        </Box>
      </TopNav>
      <DashboardCard paddingX={6}>
        <Box __width="370px">
          <SearchInput
            size="medium"
            initialSearch={query}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onSearchChange={newQuery => handleQueryChange(newQuery)}
          />
        </Box>

        <InstalledExtensionsList
          installedExtensions={[...pendingInstallations, ...filteredInstalledExtensions]}
          loading={pendingInstallationsLoading || installedAppsLoading}
          clearSearch={() => handleQueryChange("")}
          searchQuery={query}
        />

        <DeleteFailedInstallationDialog
          confirmButtonState={deleteInProgressAppStatus}
          name={pendingInstallations.find(installation => installation.id === params?.id)?.name}
          onClose={closeModal}
          onConfirm={() => handleRemoveInProgress(params?.id || "")}
          open={params.action === "app-installation-remove"}
        />
      </DashboardCard>
    </ListPageLayout>
  );
};
