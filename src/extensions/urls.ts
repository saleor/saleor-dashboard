import { Dialog, SingleAction } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: urlJoin(extensionsSection, "installed"),
  exploreExtensions: urlJoin(extensionsSection, "explore"),
  addCustomExtension: urlJoin(extensionsSection, "custom", "add"),
  resolveEditCustomExtension: (id: string) => urlJoin(extensionsSection, "custom", id),
  resolveAddCustomExtensionWebhook: (id: string) =>
    urlJoin(extensionsSection, "custom", id, "webhook"),
  resolveEditCustomExtensionWebhook: (appId: string, webhookId: string) =>
    urlJoin(extensionsSection, "custom", appId, "webhook", webhookId),
  installCustomExtension: urlJoin(extensionsSection, "install"),
  resolveEditPluginExtension: (id: string) => urlJoin(extensionsSection, "plugin", id),
};

export const MANIFEST_ATTR = "manifestUrl";
export type ExtensionInstallQueryParams = { [MANIFEST_ATTR]?: string };
export type ExtensionsListUrlDialog = "app-installation-remove";
export type ExtensionsListUrlQueryParams = Dialog<ExtensionsListUrlDialog> & SingleAction;
export type PluginUrlDialog = "clear" | "edit";
export type PluginUrlQueryParams = Dialog<PluginUrlDialog> & SingleAction;
export type CustomExtensionDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";
export type CustomExtensionDetailsUrlQueryParams = Dialog<CustomExtensionDetailsUrlDialog> &
  SingleAction;

export const ExtensionsUrls = {
  resolveInstalledExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.installedExtensions + "?" + stringifyQs(params),
  resolveExploreExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.exploreExtensions + "?" + stringifyQs(params),
  resolveInstallCustomExtensionUrl: (params?: ExtensionInstallQueryParams) =>
    ExtensionsPaths.installCustomExtension + "?" + stringifyQs(params),
  addCustomExtensionUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.addCustomExtension + "?" + stringifyQs(params),
  editCustomExtensionUrl: (id: string, params?: CustomExtensionDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveEditCustomExtension(id) + "?" + stringifyQs(params),
  installCustomExtensionUrl: (params?: ExtensionInstallQueryParams) =>
    ExtensionsPaths.installCustomExtension + "?" + stringifyQs(params),
  resolveEditPluginExtensionUrl: (id: string, params?: PluginUrlQueryParams) =>
    ExtensionsPaths.resolveEditPluginExtension(id) + "?" + stringifyQs(params),
  resolveAddCustomExtensionWebhookUrl: (id: string, params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.resolveAddCustomExtensionWebhook(id) + "?" + stringifyQs(params),
  resolveEditCustomExtensionWebhookUrl: (id: string, webhookId: string) =>
    ExtensionsPaths.resolveEditCustomExtensionWebhook(id, webhookId),
};
