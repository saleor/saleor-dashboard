import { getAbsoluteApiUrl } from "@dashboard/config";
import { FlagList } from "@dashboard/featureFlags";
import { stringifyQs } from "@dashboard/utils/urls";
import { ThemeType } from "@saleor/app-sdk/app-bridge";
import urlJoin from "url-join";

import { Dialog, SingleAction } from "../types";

type AppDetailsUrlDialog = "app-activate" | "app-deactivate" | "app-delete";
export interface AppDetailsUrlMountQueryParams {
  productId?: string;
  productIds?: string[];
  productSlug?: string;
  orderId?: string;
  customerId?: string;
  customerIds?: string[];
  collectionId?: string;
  giftCardId?: string;
  voucherId?: string;
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

export const AppSections = {
  appsSection: "/apps/",
};

export const AppPaths = {
  appListPath: AppSections.appsSection,
  resolveAppPath: (id: string) => urlJoin(AppSections.appsSection, id, "app"),
  resolveAppDetailsPath: (id: string) => urlJoin(AppSections.appsSection, id),
  appInstallPath: urlJoin(AppSections.appsSection, "install"),
};

export const AppUrls = {
  resolveAppUrl: (id: string, params?: AppDetailsUrlQueryParams) =>
    AppPaths.resolveAppPath(encodeURIComponent(id)) + "?" + stringifyQs(params),
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
