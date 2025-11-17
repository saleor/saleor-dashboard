import { getAbsoluteApiUrl } from "@dashboard/config";
import { FlagList } from "@dashboard/featureFlags";
import { Dialog, SingleAction } from "@dashboard/types";
import { stringifyQs } from "@dashboard/utils/urls";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import urlJoin from "url-join";

export const LegacyAppSections = {
  appsSection: "/apps/",
};

export const LegacyAppPaths = {
  appListPath: LegacyAppSections.appsSection,
  resolveAppPath: (id: string) => urlJoin(LegacyAppSections.appsSection, id, "app"),
};

export const extensionsSection = "/extensions";
export const extensionsCustomSection = `${extensionsSection}/custom`;
export const extensionsAppSection = `${extensionsSection}/app`;
export const extensionsPluginSection = `${extensionsSection}/plugin`;

export const ExtensionsPaths = {
  // General
  installedExtensions: urlJoin(extensionsSection, "installed"),
  exploreExtensions: urlJoin(extensionsSection, "explore"),

  // Custom apps
  addCustomExtension: urlJoin(extensionsCustomSection, "add"),
  resolveEditCustomExtension: (id: string) => urlJoin(extensionsCustomSection, id),
  resolveAddCustomExtensionWebhook: (id: string) => urlJoin(extensionsCustomSection, id, "webhook"),
  resolveEditCustomExtensionWebhook: (appId: string, webhookId: string) =>
    urlJoin(extensionsCustomSection, appId, "webhook", webhookId),

  // Manifest apps
  resolveViewManifestExtension: (id: string) => urlJoin(extensionsAppSection, id),
  resolveEditManifestExtension: (id: string) => urlJoin(extensionsAppSection, id, "edit"),
  resolveAppDeepPath: (id: string, subPath: string) =>
    urlJoin(ExtensionsPaths.resolveViewManifestExtension(id), subPath),
  resolveAppRequestPermissionsPath: (id: string) =>
    urlJoin(ExtensionsPaths.resolveViewManifestExtension(id), "edit", "permissions"),
  installCustomExtension: urlJoin(extensionsAppSection, "install"),

  // Plugins
  resolveEditPluginExtension: (id: string) => urlJoin(extensionsPluginSection, id),
};

type TranslationContext =
  | "product"
  | "variant"
  | "category"
  | "collection"
  | "sale"
  | "voucher"
  | "model"
  | "attribute"
  | "shipping-method"
  | "structure";

export const MANIFEST_ATTR = "manifestUrl";
export type ExtensionInstallQueryParams = { [MANIFEST_ATTR]?: string };
export type ExtensionsListUrlDialog = "app-installation-remove";
export type ExtensionsListUrlQueryParams = Dialog<ExtensionsListUrlDialog> & SingleAction;
export type AppDetailsUrlDialog = "app-activate" | "app-deactivate" | "app-delete";
export interface AppDetailsUrlMountQueryParams {
  attributeId?: string;
  attributeIds?: string[];
  productId?: string;
  productIds?: string[];
  productSlug?: string;
  orderId?: string;
  customerId?: string;
  customerIds?: string[];
  categoryIds?: string[];
  categoryId?: string;
  collectionId?: string;
  collectionIds?: string[];
  giftCardId?: string;
  giftCardIds?: string[];
  draftOrderId?: string;
  draftOrderIds?: string[];
  discountId?: string;
  voucherId?: string;
  voucherIds?: string[];
  pageId?: string;
  pageIds?: string[];
  pageTypeId?: string;
  pageTypeIds?: string[];
  menuId?: string;
  menuIds?: string[];
  translationContext?: TranslationContext;
  saleId?: string;
  saleIds?: string[];
  structureId?: string;
  structureIds?: string[];
  shippingMethodId?: string;
  shippingMethodIds?: string[];
  translationLanguage?: string;
}
interface FeatureFlagsQueryParams {
  featureFlags?: FlagList;
}
interface AppDetailsCommonParams {
  theme: ThemeType;
}

export type AppDetailsUrlQueryParams = Dialog<AppDetailsUrlDialog> &
  SingleAction &
  AppDetailsUrlMountQueryParams &
  FeatureFlagsQueryParams;
export type PluginUrlDialog = "clear" | "edit";
export type PluginUrlQueryParams = Dialog<PluginUrlDialog> & SingleAction;
export type CustomExtensionDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate"
  | "app-delete";
export type CustomExtensionDetailsUrlQueryParams = Dialog<CustomExtensionDetailsUrlDialog> &
  SingleAction;

export const ExtensionsUrls = {
  resolveInstalledExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.installedExtensions + "?" + stringifyQs(params),
  resolveExploreExtensionsUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.exploreExtensions + "?" + stringifyQs(params),
  resolveInstallCustomExtensionUrl: (manifestUrl?: string) =>
    ExtensionsPaths.installCustomExtension +
    "?" +
    stringifyQs({ manifestUrl } as ExtensionInstallQueryParams),
  addCustomExtensionUrl: (params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.addCustomExtension + "?" + stringifyQs(params),
  editCustomExtensionUrl: (id: string, params?: CustomExtensionDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveEditCustomExtension(encodeURIComponent(id)) + "?" + stringifyQs(params),
  installCustomExtensionUrl: (params?: ExtensionInstallQueryParams) =>
    ExtensionsPaths.installCustomExtension + "?" + stringifyQs(params),
  resolveEditPluginExtensionUrl: (id: string, params?: PluginUrlQueryParams) =>
    ExtensionsPaths.resolveEditPluginExtension(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAddCustomExtensionWebhookUrl: (id: string, params?: ExtensionsListUrlQueryParams) =>
    ExtensionsPaths.resolveAddCustomExtensionWebhook(encodeURIComponent(id)) +
    "?" +
    stringifyQs(params),
  resolveEditCustomExtensionWebhookUrl: (id: string, webhookId: string) =>
    ExtensionsPaths.resolveEditCustomExtensionWebhook(
      encodeURIComponent(id),
      encodeURIComponent(webhookId),
    ),
  resolveViewManifestExtensionUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(id)) +
    "?" +
    stringifyQs(params),
  resolveEditManifestExtensionUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveEditManifestExtension(encodeURIComponent(id)) +
    "?" +
    stringifyQs(params),
  resolveAppDeepUrl: (id: string, subPath: string, params?: AppDetailsUrlQueryParams) =>
    ExtensionsPaths.resolveAppDeepPath(encodeURIComponent(id), subPath) + "?" + stringifyQs(params),

  // Used when checking if navigation was made inside app iframe
  isAppDeepUrlChange: (appId: string, from: string, to: string) => {
    const appCompletePath = ExtensionsUrls.resolveViewManifestExtensionUrl(
      encodeURIComponent(appId),
    ).replace("?", "");

    // Handle legacy app navigation made to /apps/XYZ/app
    const legacyAppCompletePath = LegacyAppPaths.resolveAppPath(appId);

    return (
      (to.startsWith(appCompletePath) || to.startsWith(legacyAppCompletePath)) &&
      (from.startsWith(appCompletePath) || from.startsWith(legacyAppCompletePath))
    );
  },

  resolveAppDeepPathFromDashboardUrl: (dashboardUrl: string, appId: string) => {
    const deepSubPath = dashboardUrl.replace(
      ExtensionsUrls.resolveViewManifestExtensionUrl(encodeURIComponent(appId)),
      "",
    );

    return deepSubPath || "/";
  },

  resolveAppIframeUrl: (
    appId: string,
    appUrl: string,
    params: AppDetailsUrlQueryParams & AppDetailsCommonParams,
  ) => {
    const apiUrl = getAbsoluteApiUrl();
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

  // Used to resolve app url in app dashboard extensions mounting points
  // (these are navigation items app can install in dashboard)
  resolveDashboardUrlFromAppCompleteUrl: (
    appCompleteUrl: string,
    appUrl?: string,
    appId?: string,
  ) => {
    if (!appUrl || !appId) {
      return appUrl;
    }

    const deepSubPath = appCompleteUrl.replace(appUrl, "");
    const dashboardUrl = urlJoin(
      ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(appId)),
      deepSubPath,
    );

    return dashboardUrl;
  },

  // Used to resolve app url in iframe
  resolveAppCompleteUrlFromDashboardUrl: (
    dashboardUrl: string,
    appUrl?: string,
    appId?: string,
  ) => {
    if (!appUrl || !appId) {
      return appUrl;
    }

    const deepSubPath = dashboardUrl.replace(
      ExtensionsPaths.resolveViewManifestExtension(encodeURIComponent(appId)),
      "",
    );
    const appCompleteUrl = urlJoin(appUrl, deepSubPath);

    return appCompleteUrl;
  },

  // Used to resolve special URL to request app permissions
  resolveRequestPermissionsUrl: (
    id: string,
    params: {
      requestedPermissions: string[];
      redirectPath: string;
    },
  ) =>
    urlJoin(
      ExtensionsPaths.resolveAppRequestPermissionsPath(id),
      `?${stringifyQs({
        redirectPath: params.redirectPath,
        requestedPermissions: params.requestedPermissions.join(","),
      })}`,
    ),
};

type CustomAppDetailsUrlDialog =
  | "create-token"
  | "remove-webhook"
  | "remove-token"
  | "app-activate"
  | "app-deactivate";

export type CustomAppDetailsUrlQueryParams = Dialog<CustomAppDetailsUrlDialog> & SingleAction;
