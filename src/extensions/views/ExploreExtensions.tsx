import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback } from "react";
import { useIntl } from "react-intl";

import { ExtensionsList } from "../components/ExtensionsList";
import { useExploreExtensions } from "../hooks/useExploreExtenstions";
import { messages } from "../messages";

export const ExploreExtensions = () => {
  const intl = useIntl();
  const extensions = useExploreExtensions();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();
  const navigate = useNavigator();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  return (
    <>
      <TopNav title={intl.formatMessage(sectionNames.extensions)}>
        {hasManagedAppsPermission && (
          <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
        )}
      </TopNav>
      <Box paddingX={6}>
        <Box __width="370px" marginTop={8} marginBottom={12}>
          <SearchInput
            withBorder
            size="medium"
            initialSearch={""}
            placeholder={intl.formatMessage(messages.searchPlaceholder)}
            onSearchChange={() => {
              // TODO: Implement search logic
              // eslint-disable-next-line no-console
              console.log("On search change");
            }}
          />
        </Box>

        <ExtensionsList extensions={extensions} />
      </Box>
    </>
  );
};
