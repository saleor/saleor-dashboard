import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import React, { useCallback, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";

export const ExploreExtensionsActions = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const navigateToAppInstallPage = useCallback(
    (manifestUrl: string) => {
      navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
    },
    [navigate],
  );

  const addExtensionOptions = useMemo(
    () => [
      {
        label: intl.formatMessage(buttonLabels.installFromManifest),
        testId: "install-custom-extension",
        onSelect: () => navigate(ExtensionsUrls.installCustomExtensionUrl()),
      },
      {
        label: intl.formatMessage(buttonLabels.installManually),
        testId: "add-custom-extension",
        onSelect: () => navigate(ExtensionsUrls.addCustomExtensionUrl()),
      },
    ],
    [intl, navigate],
  );

  return (
    <Box display="flex" gap={4} alignItems="center">
      <RequestExtensionsButton />

      {hasManagedAppsPermission && (
        <>
          {isExtensionsDevEnabled ? (
            <ButtonWithDropdown
              variant="primary"
              options={addExtensionOptions}
              testId="add-extension-button"
            >
              <FormattedMessage {...buttonLabels.addExtension} />
            </ButtonWithDropdown>
          ) : (
            <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
          )}
        </>
      )}
    </Box>
  );
};
