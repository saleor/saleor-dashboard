import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const exploreExtensionsPath = `${extensionsSection}/`;

export const installedExtensionsPath = urlJoin(extensionsSection, "installed");
