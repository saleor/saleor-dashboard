import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import { buttonLabels } from "@dashboard/extensions/messages";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { useHasManagedAppsPermission } from "@dashboard/hooks/useHasManagedAppsPermission";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useMemo } from "react";
import { useIntl } from "react-intl";

export const AddExtensionDropdown = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const { hasManagedAppsPermission } = useHasManagedAppsPermission();

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

  if (hasManagedAppsPermission) {
    return (
      <ButtonWithDropdown
        variant="primary"
        options={addExtensionOptions}
        testId="add-extension-button"
      >
        {intl.formatMessage(buttonLabels.addExtension)}
      </ButtonWithDropdown>
    );
  }

  return null;
};
