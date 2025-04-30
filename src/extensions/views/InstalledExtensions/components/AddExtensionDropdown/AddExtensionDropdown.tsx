import { InstallWithManifestFormButton } from "@dashboard/apps/components/InstallWithManifestFormButton";
import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { RequestExtensionsButton } from "@dashboard/extensions/components/RequestExtensionsButton";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useFlag } from "@dashboard/featureFlags";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { PlusIcon } from "@saleor/macaw-ui-next";
import React from "react";

interface AddExtensionDropdownProps {
  testId?: string;
}

export const AddExtensionDropdown: React.FC<AddExtensionDropdownProps> = ({
  testId = "add-extension-button",
}) => {
  const navigate = useNavigator();
  const { enabled: isExtensionsDevEnabled } = useFlag("extensions_dev");
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

  const navigateToAppInstallPage = () => {
    navigate(ExtensionsUrls.installCustomExtensionUrl());
  };

  const addExtensionOptions = [
    {
      label: "Explore",
      testId: "explore-extensions",
      onSelect: () => navigate(ExtensionsUrls.resolveExploreExtensionsUrl()),
    },
    {
      label: "Install from manifest",
      testId: "install-custom-extension",
      onSelect: () => navigate(ExtensionsUrls.installCustomExtensionUrl()),
    },
    {
      label: "Provide details manually",
      testId: "add-custom-extension",
      onSelect: () => navigate(ExtensionsUrls.addCustomExtensionUrl()),
    },
  ];

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
      testId={testId}
    >
      Add Extension
    </ButtonWithDropdown>
  );
};
