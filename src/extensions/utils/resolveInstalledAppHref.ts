import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppTypeEnum } from "@dashboard/graphql";

export type AlreadyInstalledAppLinkTarget = "app" | "settings";

export const resolveAlreadyInstalledAppLinkTarget = ({
  type,
  isActive,
  appUrl,
}: {
  type: AppTypeEnum | null;
  isActive: boolean | null;
  appUrl?: string | null;
}): AlreadyInstalledAppLinkTarget => {
  if (type === AppTypeEnum.LOCAL) {
    return "settings";
  }

  if (isActive && appUrl) {
    return "app";
  }

  return "settings";
};

export const resolveInstalledAppHref = ({
  id,
  type,
  isActive,
  appUrl,
}: {
  id: string;
  type: AppTypeEnum | null;
  isActive: boolean | null;
  appUrl?: string | null;
}): string => {
  if (type === AppTypeEnum.LOCAL) {
    return ExtensionsUrls.editCustomExtensionUrl(id);
  }

  if (!isActive || !appUrl) {
    return ExtensionsUrls.resolveEditManifestExtensionUrl(id);
  }

  return ExtensionsUrls.resolveViewManifestExtensionUrl(id);
};
