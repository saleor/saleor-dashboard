// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace GetV2SaleorAppsResponse {
  export interface SaleorAppBase {
    name: {
      en: string;
    };
    description: {
      en: string;
    };
    logo: {
      source: string | null;
      color: string;
    };
    integrations: Array<{
      name: string;
      logo: {
        light: {
          source: string;
        };
        dark: {
          source: string;
        };
      };
    }>;
  }

  export type ReleasedSaleorApp = SaleorAppBase & {
    repositoryUrl: string;
    supportUrl: string;
    privacyUrl: string;
    manifestUrl: string;
    vercelDeploymentUrl?: string;
  };

  export type ComingSoonSaleorApp = SaleorAppBase & {
    releaseDate: string;
  };

  export type SaleorApp = ReleasedSaleorApp | ComingSoonSaleorApp;
}
