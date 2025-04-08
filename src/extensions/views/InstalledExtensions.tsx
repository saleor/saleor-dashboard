import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { useInstalledExtensionsMocks } from "@dashboard/extensions/hooks/useInstalledExtensionsMocks";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useState } from "react";
import { useIntl } from "react-intl";

import { InstalledExtensionsList } from "../components/InstalledExtensionsList";
import { RequestExtensionsButton } from "../components/RequestExtensionsButton";

export const InstalledExtensions = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [query, setQuery] = useState("");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const installedExtensions = useInstalledExtensionsMocks();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

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

        <InstalledExtensionsList installedExtensions={installedExtensions} />
      </Box>
    </>
  );
};
