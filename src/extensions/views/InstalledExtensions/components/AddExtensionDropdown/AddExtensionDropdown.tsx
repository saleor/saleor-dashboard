import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { AppUrls } from "@dashboard/apps/urls";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

export const AddExtensionDropdown = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const navigateToAppInstallPage = (manifestUrl: string) => {
    navigate(AppUrls.resolveAppInstallUrl(manifestUrl));
  };

  const addExtensionOptions = useMemo(
    () => [
      {
        label: intl.formatMessage(buttonLabels.explore),
        testId: "explore-extensions",
        onSelect: () => navigate(ExtensionsUrls.resolveExploreExtensionsUrl()),
      },
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

  if (!isExtensionsDevEnabled) {
    // Display old navigation
    return (
      <>
        <RequestExtensionsButton />
        {hasManagedAppsPermission && (
          <InstallWithManifestFormButton onSubmitted={navigateToAppInstallPage} />
        )}
      </>
    );
  }

  return (
    <ButtonWithDropdown
      variant="primary"
      options={addExtensionOptions}
      testId="add-extension-button"
    >
      {intl.formatMessage(buttonLabels.addExtension)}
    </ButtonWithDropdown>
  );
};
