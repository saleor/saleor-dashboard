import { Dialog, SingleAction } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: extensionsSection,
  exploreExtensions: urlJoin(extensionsSection, "explore"),
  addCustomExtension: urlJoin(extensionsSection, "custom", "add"),
  resolveEditCustomExtension: (id: string) => urlJoin(extensionsSection, "custom", id),
  // TODO: Add custom app (extension) webhook edition urls
};

export const ExtensionsUrls = {
  resolveInstalledExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.installedExtensions + "?" + stringifyQs(params),
  resolveExploreExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.exploreExtensions + "?" + stringifyQs(params),
  addCustomExtensionUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.addCustomExtension + "?" + stringifyQs(params),
  editCustomExtensionUrl: (id: string, params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.resolveEditCustomExtension(id) + "?" + stringifyQs(params),
};

export type ExtensionsListUrlDialog = "app-installation-remove";
export type ExtensionsListUrlQueryParams = Dialog<ExtensionsListUrlDialog> & SingleAction;
