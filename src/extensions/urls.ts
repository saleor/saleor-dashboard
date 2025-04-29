import { getApiUrl } from "@dashboard/config";
import { FlagList } from "@dashboard/featureFlags";
import { Dialog, SingleAction } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import urlJoin from "url-join";

export const extensionsSection = "/extensions";

export const ExtensionsPaths = {
  installedExtensions: extensionsSection,
  exploreExtensions: urlJoin(extensionsSection, "explore"),
  addCustomExtension: urlJoin(extensionsSection, "custom", "add"),
  resolveViewManifestExtension: (id: string) => urlJoin(extensionsSection, "app", id),
  resolveEditManifestExtension: (id: string) => urlJoin(extensionsSection, "app", id, "edit"),
  resolveEditCustomExtension: (id: string) => urlJoin(extensionsSection, "custom", id),
  // TODO: Add custom app (extension) webhook edition urls
  installCustomExtension: urlJoin(extensionsSection, "install"),
};

export const MANIFEST_ATTR = "manifestUrl";
export type ExtensionInstallQueryParams = { [MANIFEST_ATTR]?: string };
export type ExtensionsListUrlDialog = "app-installation-remove";
export type ExtensionsListUrlQueryParams = Dialog<ExtensionsListUrlDialog> & SingleAction;
export type AppDetailsUrlDialog = "app-activate" | "app-deactivate" | "app-delete";
export interface AppDetailsUrlMountQueryParams {
  productId?: string;
  productIds?: string[];
  orderId?: string;
  customerId?: string;
  customerIds?: string[];
}
interface FeatureFlagsQueryParams {
  featureFlags?: FlagList;
}
export interface AppDetailsCommonParams {
  theme: ThemeType;
}

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction &
  AppDetailsUrlMountQueryParams &
  FeatureFlagsQueryParams;

export const ExtensionsUrls = {
  resolveInstalledExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.installedExtensions + "?" + stringifyQs(params),
  resolveExploreExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.exploreExtensions + "?" + stringifyQs(params),
  addCustomExtensionUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.addCustomExtension + "?" + stringifyQs(params),
  editCustomExtensionUrl: (id: string, params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.resolveEditCustomExtension(id) + "?" + stringifyQs(params),
  installCustomExtensionUrl: (params?: ExtensionInstallQueryParams) =>
    ExtensionsPaths.installCustomExtension + "?" + stringifyQs(params),
  resolveViewManifestExtensionUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveViewManifestExtension(id) + "?" + stringifyQs(params),
  resolveEditManifestExtensionUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveEditManifestExtension(id) + "?" + stringifyQs(params),
  resolveAppIframeUrl: (
    appId: string,
    appUrl: string,
    params: AppDetailsUrlQueryParams & AppDetailsCommonParams,
  ) => {
    const apiUrl = new URL(getApiUrl(), window.location.origin).href;
    /**
     * Use host to preserve port, in case of multiple Saleors running on localhost
     */
    const apiUrlHost = new URL(apiUrl).host;
    const iframeContextQueryString = `?${stringifyQs(
      {
        /**
         * @deprecated - domain will be removed in favor of saleorApiUrl.
         * Current hostname (used as domain) can be extracted from full URL
         *
         * Difference will be:
         * shop.saleor.cloud -> https://shop.saleor.cloud/graphql/
         */
        domain: apiUrlHost,
        saleorApiUrl: apiUrl,
        id: appId,
        ...params,
      },
      "comma",
    )}`;

    return urlJoin(appUrl, window.location.search, iframeContextQueryString);
  },
};
