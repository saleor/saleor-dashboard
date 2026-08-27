import { ContextualHelpIcon } from "@dashboard/components/AppLayout/ContextualLinks/ContextualHelpIcon";
import { contextualLinks } from "@dashboard/components/AppLayout/ContextualLinks/messages";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import {
  type ExtensionsListUrlDialog,
  type ExtensionsListUrlQueryParams,
  ExtensionsUrls,
} from "@dashboard/extensions/urls";
import { useInstalledExtensionsFilter } from "@dashboard/extensions/views/InstalledExtensions/hooks/useInstalledExtensionsFilter";
import { useAppAllProblemsLazyQuery, useAppProblemDismissMutation } from "@dashboard/graphql";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier";
import { EXTENSIONS_DOCS_URL } from "@dashboard/links";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { useOnboarding } from "@dashboard/welcomePage/WelcomePageOnboarding/onboardingContext";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useCallback, useEffect } from "react";
import { useIntl } from "react-intl";

import { AddExtensionDropdown } from "./components/AddExtensionDropdown/AddExtensionDropdown";
import { ProblemsHeaderBadge } from "./components/AppProblems/ProblemsHeaderBadge/ProblemsHeaderBadge";
import { DeleteFailedInstallationDialog } from "./components/DeleteFailedInstallationDialog";
import { InstalledExtensionsList } from "./components/InstalledExtensionsList/InstalledExtensionsList";
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
  const extensionsHelpLabel = intl.formatMessage(contextualLinks.extensions, {
    extensions: intl.formatMessage(contextualLinks.extensionsDocs),
  });

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

  const notify = useNotifier();

  const {
    installedExtensions,
    installedAppsLoading,
    refetchInstalledApps,
    totalCount,
    criticalCount,
  } = useInstalledExtensions();
  const { query, handleQueryChange, filteredInstalledExtensions } =
    useInstalledExtensionsFilter(installedExtensions);

  const [fetchAllProblems] = useAppAllProblemsLazyQuery({
    fetchPolicy: "network-only",
  });

  const handleFetchAllProblems = useCallback(
    (appId: string) => {
      fetchAllProblems({ variables: { id: appId } });
    },
    [fetchAllProblems],
  );

  const [appProblemDismiss] = useAppProblemDismissMutation({
    onCompleted: data => {
      const errors = data?.appProblemDismiss?.errors ?? [];

      if (errors.length === 0) {
        refetchInstalledApps();
      } else {
        errors.forEach(error => notify({ status: "error", text: error.message ?? "" }));
      }
    },
  });

  const handleClearProblem = useCallback(
    (problemId: string) => {
      appProblemDismiss({
        variables: {
          input: {
            byStaffWithIds: {
              ids: [problemId],
            },
          },
        },
      });
    },
    [appProblemDismiss],
  );

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
      >
        <Box __flex={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Text size={6} fontWeight="regular">
              {intl.formatMessage(headerTitles.installedExtensions)}
            </Text>
            <ProblemsHeaderBadge totalCount={totalCount} criticalCount={criticalCount} />
          </Box>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Box display="flex" alignItems="center" marginRight={3}>
            <ContextualHelpIcon
              href={EXTENSIONS_DOCS_URL}
              label={extensionsHelpLabel}
              analyticsType="extensions_docs"
              dataTestId="extensions-docs"
            />
          </Box>
          {hasManagedAppsPermission && <AddExtensionDropdown />}
        </Box>
      </TopNav>
      <DashboardCard paddingX={6}>
        <Box __width="370px">
          <SearchInput
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
          hasManagedAppsPermission={hasManagedAppsPermission}
          onClearProblem={handleClearProblem}
          onFetchAllProblems={handleFetchAllProblems}
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
