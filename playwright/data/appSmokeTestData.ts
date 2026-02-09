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
      expectedText: "No Adyen configurations added.",
    },
    {
      id: "QXBwOjc2",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "No configurations created yet",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      expectedText: "No configurations yet",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      expectedText: "test_token",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "See what your app can do",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      expectedText: "DISABLED",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      expectedText: "Saleor Cloud SMTP available",
    },
  ],
  v321: [
    {
      id: "QXBwOjc0",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "No configurations created yet",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      expectedText: "No configurations yet",
    },
    {
      id: "QXBwOjc2",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      expectedText: "test_token",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "See what your app can do",
    },
    {
      id: "QXBwOjgw",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      expectedText: "DISABLED",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      expectedText: "Saleor Cloud SMTP available",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "Configuration",
      expectedText: "No configurations found",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Configuration",
      expectedText: "{{variant.product.name}} - {{variant.name}}",
    },
    {
      id: "QXBwOjgx",
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Configuration",
      expectedText: "No configurations found",
    },
    {
      id: "QXBwOjgy",
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Configuration",
      expectedText: "DISABLED",
    },
  ],
  v322: [
    {
      id: "QXBwOjc2",
      identifier: "app.saleor.adyen_staging",
      name: "Adyen",
      heading: "Adyen",
      expectedText: "No Adyen configurations added.",
    },
    {
      id: "QXBwOjc1",
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      expectedText: "No configurations created yet",
    },
    {
      id: "QXBwOjc3",
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      expectedText: "No configurations yet",
    },
    {
      id: "QXBwOjc0",
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      expectedText: "test_token",
    },
    {
      id: "QXBwOjcx",
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      expectedText: "See what your app can do",
    },
    {
      id: "QXBwOjgw",
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      expectedText: "DISABLED",
    },
    {
      id: "QXBwOjgx",
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      expectedText: "Saleor Cloud SMTP available",
    },
    {
      id: "QXBwOjc4",
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "Configuration",
      expectedText: "No configurations found",
    },
    {
      id: "QXBwOjc5",
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Configuration",
      expectedText: "{{variant.product.name}} - {{variant.name}}",
    },
    {
      id: "QXBwOjgy",
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Configuration",
      expectedText: "No configurations found",
    },
    {
      id: "QXBwOjgz",
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Configuration",
      expectedText: "DISABLED",
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
