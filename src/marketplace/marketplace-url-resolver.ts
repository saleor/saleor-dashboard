import {
  MARKETPLACE_APP_TEMPLATE_GALLERY_PATH,
  MARKETPLACE_SALEOR_APPS_JSON_PATH,
  MARKETPLACE_SALEOR_APPS_PAGE_PATH,
  MARKETPLACE_URL,
} from "@saleor/config";
import urlJoin from "url-join";

export class MarketplaceUrlResolver {
  private rootSection = "/marketplace";

  private marketplaceAppBaseUrl = MARKETPLACE_URL;
  private saleorAppsPath = MARKETPLACE_SALEOR_APPS_PAGE_PATH;
  private saleorAppsJsonPath = MARKETPLACE_SALEOR_APPS_JSON_PATH;
  private templateGalleryJsonPath = MARKETPLACE_APP_TEMPLATE_GALLERY_PATH;

  checkMarketplaceConfigExists() {
    return Boolean(
      this.marketplaceAppBaseUrl &&
        this.saleorAppsPath &&
        this.saleorAppsJsonPath &&
        this.templateGalleryJsonPath,
    );
  }

  getMarketplaceDeepUrlFromPath(path: string) {
    return path.replace(this.rootSection, "");
  }

  getTemplateGalleryDashboardUrl(dashboardLocation: string) {
    return urlJoin(
      new URL(dashboardLocation).origin,
      this.rootSection,
      MARKETPLACE_APP_TEMPLATE_GALLERY_PATH,
    );
  }

  getSaleorAppsDashboardUrl(dashboardLocation: string) {
    return urlJoin(
      new URL(dashboardLocation).origin,
      this.rootSection,
      MARKETPLACE_SALEOR_APPS_PAGE_PATH,
    );
  }

  getSaleorAppsJsonEndpoint() {
    return urlJoin(this.marketplaceAppBaseUrl, this.saleorAppsJsonPath);
  }
}

export const marketplaceUrlResolver = new MarketplaceUrlResolver();
