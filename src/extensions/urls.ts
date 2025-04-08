import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: extensionsSection,
  exploreExtensions: urlJoin(extensionsSection, "explore"),
  installCustomExtension: urlJoin(extensionsSection, "install"),
};

export const MANIFEST_ATTR = "manifestUrl";
export type ExtensionInstallQueryParams = { [MANIFEST_ATTR]?: string };
