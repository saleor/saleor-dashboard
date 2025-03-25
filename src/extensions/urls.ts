import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: extensionsSection,
  exploreExtensions: urlJoin(extensionsSection, "explore"),
};
