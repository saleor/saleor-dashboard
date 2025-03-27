import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { ExtensionsList } from "../components/ExtensionsList";
import { useExploreExtensions } from "../hooks/useExploreExtensions";
import { useExtensionsFilter } from "../hooks/useExtenstionsFilter";
import { headerTitles, messages } from "../messages";

export const ExploreExtensions = () => {
  const intl = useIntl();
  const { extensions, loading, error } = useExploreExtensions();
  const { handleQueryChange, query, filteredExtensions } = useExtensionsFilter({ extensions });
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const navigate = useNavigator();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  if (error) {
    // We want to show the default error page when app store api does not work
    throw new Error(error);
  }

  return (
    <>
      <TopNav title={intl.formatMessage(headerTitles.exploreExtensions)}>
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
            onSearchChange={handleQueryChange}
          />
        </Box>

        <ExtensionsList
          extensions={filteredExtensions}
          loading={loading}
          clearSearch={() => handleQueryChange("")}
        />
      </Box>
    </>
  );
};
