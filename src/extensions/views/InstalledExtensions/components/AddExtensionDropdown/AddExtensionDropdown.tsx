import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PlusIcon } from "@saleor/macaw-ui-next";
import React, { useMemo } from "react";
import { useIntl } from "react-intl";

export const AddExtensionDropdown = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions_dev");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const navigateToAppInstallPage = () => {
    navigate(ExtensionsUrls.installCustomExtensionUrl());
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
      icon={<PlusIcon />}
      options={addExtensionOptions}
      testId="add-extension-button"
    >
      Add Extension
    </ButtonWithDropdown>
  );
};
