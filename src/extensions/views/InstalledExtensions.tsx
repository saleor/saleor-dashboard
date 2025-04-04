import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { TopNav } from "@dashboard/components/AppLayout";
import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { AppDisabledInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/AppDisabledInfo";
import { FailedInstallationActions } from "@dashboard/extensions/components/InstalledExtensionsList/componets/FailedInstallationActions";
import { InstallationPendingInfo } from "@dashboard/extensions/components/InstalledExtensionsList/componets/InstallationPendingInfo";
import { ViewDetailsActionButton } from "@dashboard/extensions/components/InstalledExtensionsList/componets/ViewDetailsActionButton";
import { useInstalledExtensionsData } from "@dashboard/extensions/hooks/useInstalledExtensionsData";
import { headerTitles, messages } from "@dashboard/extensions/messages";
import { InstalledExtension } from "@dashboard/extensions/types";
import { AppInstallationFragment, InstalledAppDetailsFragment } from "@dashboard/graphql";
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

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  const { data, loading } = useInstalledExtensionsData();

  const installationInProgress = data.appsInstallation.map(toInProgressExtension);
  const installedApps = data.apps.map(toInstalledExtension);

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
          installedExtensions={[...installationInProgress, ...installedApps]}
          loading={loading}
        />
      </Box>
    </>
  );
};

function toInProgressExtension(data: AppInstallationFragment): InstalledExtension {
  return {
    id: data.id,
    name: data.appName,
    logo: data.brand?.logo?.default ?? "",
    info: <InstallationPendingInfo />,
    actions:
      data.status === "FAILED" ? (
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        <FailedInstallationActions onDelete={() => {}} onRetry={() => {}} />
      ) : (
        <ViewDetailsActionButton />
      ),
  };
}

function toInstalledExtension(data: InstalledAppDetailsFragment): InstalledExtension {
  return {
    id: data.id,
    name: data.name ?? "",
    logo: data.brand?.logo?.default ?? "",
    info: !data.isActive && <AppDisabledInfo />,
    actions: <ViewDetailsActionButton id={data.id} isDisabled={!data.isActive} />,
  };
}
