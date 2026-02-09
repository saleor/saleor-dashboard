interface AppSmokeEntry {
  id: string;
  identifier: string;
  name: string;
  heading: string;
  expectedText: string;
}

export const APP_SMOKE_DATA: Record<string, AppSmokeEntry[]> = {
  v320: [
    {
      id: "QXBwOjc0",
      identifier: "app.saleor.adyen_staging",
      name: "Adyen",
      heading: "Adyen",
      expectedText: "Channel-",
    },
    {
      id: "QXBwOjc2",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "channel-pln",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "CMS",
      expectedText: "Providers configuration",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Klaviyo",
      expectedText: "PUBLIC_TOKEN",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "Welcome to Saleor Dummy Tax App",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Search",
      expectedText: "Algolia settings",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "SMTP",
      expectedText: "Configurations",
    },
  ],
  v321: [
    {
      id: "QXBwOjc0",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "channel-pln",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "CMS",
      expectedText: "Providers configuration",
    },
    {
      id: "QXBwOjc2",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Klaviyo",
      expectedText: "PUBLIC_TOKEN",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "Welcome to Saleor Dummy Tax App",
    },
    {
      id: "QXBwOjgw",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Search",
      expectedText: "Algolia settings",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "SMTP",
      expectedText: "Configurations",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "NP Atobarai",
      expectedText: "Channels configurations",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Product Feed",
      expectedText: "Google Merchant Center",
    },
    {
      id: "QXBwOjgx",
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Stripe",
      expectedText: "Stripe configurations",
    },
    {
      id: "QXBwOjgy",
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Segment",
      expectedText: "Segment.io configuration",
    },
  ],
  v322: [
    {
      id: "QXBwOjc2",
      identifier: "app.saleor.adyen_staging",
      name: "Adyen",
      heading: "Adyen",
      expectedText: "Channel-",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "channel-pln",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "CMS",
      expectedText: "Providers configuration",
    },
    {
      id: "QXBwOjc0",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Klaviyo",
      expectedText: "PUBLIC_TOKEN",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "Welcome to Saleor Dummy Tax App",
    },
    {
      id: "QXBwOjgw",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Search",
      expectedText: "Algolia settings",
    },
    {
      id: "QXBwOjgx",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "SMTP",
      expectedText: "Configurations",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "NP Atobarai",
      expectedText: "Channels configurations",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Product Feed",
      expectedText: "Google Merchant Center",
    },
    {
      id: "QXBwOjgy",
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Stripe",
      expectedText: "Stripe configurations",
    },
    {
      id: "QXBwOjgz",
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Segment",
      expectedText: "Segment.io configuration",
    },
  ],
};

export function getVersionFromBaseUrl(baseUrl: string): string {
  const match = baseUrl.match(/v(\d{3})\./);

  return match ? `v${match[1]}` : "";
}

export function resolveAppUrl(version: string, appId: string): string {
  if (version === "v320") {
    return `apps/${appId}/app`;
  }

  return `extensions/app/${encodeURIComponent(appId)}`;
}
