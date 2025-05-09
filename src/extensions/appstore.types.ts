/**
 * Interfaces for shapes of data fetched from AppStore API.
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace AppstoreApi {
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
    manifestUrl: string | null;
    githubForkUrl?: string;
  };

  export type ComingSoonSaleorApp = SaleorAppBase & {
    releaseDate: string;
  };

  export type SaleorApp = ReleasedSaleorApp | ComingSoonSaleorApp;
}
