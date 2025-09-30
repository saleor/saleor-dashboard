import { AppHeaderOptions } from "@dashboard/extensions/components/AppHeaderOptions";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppPageNav } from "@dashboard/extensions/views/ViewManifestExtension/components/AppPage/AppPageNav";
import { AppQuery } from "@dashboard/graphql";

interface HeaderProps {
  data: AppQuery["app"];
  onAppActivateOpen: () => void;
  onAppDeactivateOpen: () => void;
  onAppDeleteOpen: () => void;
}

export const Header = ({
  data,
  onAppActivateOpen,
  onAppDeactivateOpen,
  onAppDeleteOpen,
}: HeaderProps) => {
  const getBackButtonUrl = () => {
    /**
     * App is null with first render
     */
    if (!data?.id) {
      return ExtensionsUrls.resolveInstalledExtensionsUrl();
    }

    if (data?.type === "LOCAL") {
      return ExtensionsUrls.resolveInstalledExtensionsUrl();
    }

    const isAppActive = data.isActive;

    return isAppActive
      ? ExtensionsUrls.resolveViewManifestExtensionUrl(data.id)
      : ExtensionsUrls.resolveInstalledExtensionsUrl(undefined);
  };

  if (!data) {
    return null;
  }

  return (
    <>
      <AppPageNav
        name={data.name}
        supportUrl={data.supportUrl}
        homepageUrl={data.homepageUrl}
        author={data.author}
        appLogoUrl={data.brand?.logo.default}
        appId={data.id}
        goBackUrl={getBackButtonUrl()}
        showMangeAppButton={false}
      />

      <AppHeaderOptions
        isActive={!!data.isActive}
        onAppActivateOpen={onAppActivateOpen}
        onAppDeactivateOpen={onAppDeactivateOpen}
        onAppDeleteOpen={onAppDeleteOpen}
      />
    </>
  );
};
