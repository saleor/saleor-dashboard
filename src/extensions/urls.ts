import { Dialog, SingleAction } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: extensionsSection,
  exploreExtensions: urlJoin(extensionsSection, "explore"),
  addCustomExtension: urlJoin(extensionsSection, "add-custom"),
};

export const ExtensionsUrls = {
  resolveInstalledExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.installedExtensions + "?" + stringifyQs(params),
  resolveExploreExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.exploreExtensions + "?" + stringifyQs(params),
  addCustomExtensionUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.addCustomExtension + "?" + stringifyQs(params),
};

export type ExtensionsListUrlDialog = "app-installation-remove";
export type ExtensionsListUrlQueryParams = Dialog<ExtensionsListUrlDialog> & SingleAction;
