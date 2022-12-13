export interface SaleorAppIntegration {
  name: string;
  /**
   * @deprecated
   */
  legacyLogo: string;
  logo: {
    light: string;
    dark: string;
  };
}

export interface SaleorMarketplaceApp {
  id: string;
  name: string;
  logo: string | null;
  description: string;
  features: string[];
  integrations: SaleorAppIntegration[];
}
