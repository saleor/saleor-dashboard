import { getApiUrl } from "@dashboard/config";
import { FlagList } from "@dashboard/featureFlags";
import { stringifyQs } from "@dashboard/utils/urls";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

export const MANIFEST_ATTR = "manifestUrl";

export type AppListUrlDialog = "app-installation-remove";
export type AppListUrlQueryParams = Dialog<AppListUrlDialog> & SingleAction;

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

export type AppInstallUrlQueryParams = Partial<{ [MANIFEST_ATTR]: string }>;

export const AppSections = {
  appsSection: "/apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
  resolveAppPath: (id: string) => urlJoin(AppSections.appsSection, id, "app"),
  resolveAppDetailsPath: (id: string) => urlJoin(AppSections.appsSection, id),
  resolveAppDeepPath: (id: string, subPath: string) =>
    urlJoin(AppPaths.resolveAppPath(id), subPath),
  appInstallPath: urlJoin(AppSections.appsSection, "install"),
  resolveRequestPermissionsPath: (id: string) =>
    urlJoin(AppSections.appsSection, id, "permissions"),
};

export const AppUrls = {
  resolveAppListUrl: (params?: AppListUrlQueryParams) =>
    AppPaths.appListPath + "?" + stringifyQs(params),
  resolveAppUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppDetailsUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppDetailsPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
  resolveAppInstallUrl: (manifestUrl: string) =>
    `${AppPaths.appInstallPath}?manifestUrl=${manifestUrl}`,
  resolveAppDeepUrl: (id: string, subPath: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppDeepPath(encodeURIComponent(id), subPath) + "?" + stringifyQs(params),
  isAppDeepUrlChange: (appId: string, from: string, to: string) => {
    const appCompletePath = AppPaths.resolveAppPath(encodeURIComponent(appId));

    return to.startsWith(appCompletePath) && from.startsWith(appCompletePath);
  },
  resolveAppDeepPathFromDashboardUrl: (dashboardUrl: string, appId: string) => {
    const deepSubPath = dashboardUrl.replace(
      AppPaths.resolveAppPath(encodeURIComponent(appId)),
      "",
    );
    return deepSubPath || "/";
  },
  resolveAppCompleteUrlFromDashboardUrl: (
    dashboardUrl: string,
    appUrl?: string,
    appId?: string,
  ) => {
    if (!appUrl || !appId) {
      return appUrl;
    }
    const deepSubPath = dashboardUrl.replace(
      AppPaths.resolveAppPath(encodeURIComponent(appId)),
      "",
    );
    const appCompleteUrl = urlJoin(appUrl, deepSubPath);
    return appCompleteUrl;
  },
  resolveDashboardUrlFromAppCompleteUrl: (
    appCompleteUrl: string,
    appUrl?: string,
    appId?: string,
  ) => {
    if (!appUrl || !appId) {
      return appUrl;
    }
    const deepSubPath = appCompleteUrl.replace(appUrl, "");
    const dashboardUrl = urlJoin(AppPaths.resolveAppPath(encodeURIComponent(appId)), deepSubPath);
    return dashboardUrl;
  },
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
  resolveRequestPermissionsUrl: (
    id: string,
    params: {
      requestedPermissions: string[];
      redirectPath: string;
    },
  ) =>
    urlJoin(
      AppSections.appsSection,
      id,
      "permissions",
      `?${stringifyQs({
        redirectPath: params.redirectPath,
        requestedPermissions: params.requestedPermissions.join(","),
      })}`,
    ),
};
