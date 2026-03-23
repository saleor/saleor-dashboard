import { expect, type FrameLocator } from "@playwright/test";

type ContentAssertion = (iframe: FrameLocator, timeout: number) => Promise<void>;

const expectText = (text: string): ContentAssertion => {
  return async (iframe, timeout) => {
    await expect(iframe.getByText(text).first()).toBeVisible({ timeout });
  };
};

const expectInputValue = (label: string, value: string): ContentAssertion => {
  return async (iframe, timeout) => {
    await expect(iframe.getByRole("textbox", { name: label })).toHaveValue(value, { timeout });
  };
};

interface AppSmokeEntry {
  identifier: string;
  name: string;
  heading: string;
  assertContent: ContentAssertion;
}

export const APP_SMOKE_DATA: Record<string, AppSmokeEntry[]> = {
  v320: [
    {
      identifier: "app.saleor.adyen_staging",
      name: "Adyen",
      heading: "Adyen",
      assertContent: expectText("No Adyen configurations added."),
    },
    {
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      assertContent: expectText("No configurations created yet"),
    },
    {
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      assertContent: expectText("No configurations yet"),
    },
    {
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      assertContent: expectInputValue("PUBLIC_TOKEN", "test_token"),
    },
    {
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      assertContent: expectText("See what your app can do"),
    },
    {
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      assertContent: expectText("DISABLED"),
    },
    {
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      assertContent: expectText("Saleor Cloud SMTP available"),
    },
  ],
  v321: [
    {
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      assertContent: expectText("No configurations created yet"),
    },
    {
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      assertContent: expectText("No configurations yet"),
    },
    {
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      assertContent: expectInputValue("PUBLIC_TOKEN", "test_token"),
    },
    {
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      assertContent: expectText("See what your app can do"),
    },
    {
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      assertContent: expectText("DISABLED"),
    },
    {
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      assertContent: expectText("Saleor Cloud SMTP available"),
    },
    {
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "Configuration",
      assertContent: expectText("No configurations found"),
    },
    {
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Configuration",
      assertContent: expectInputValue(
        "Title template",
        "{{variant.product.name}} - {{variant.name}}",
      ),
    },
    {
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Configuration",
      assertContent: expectText("No configurations found"),
    },
    {
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Configuration",
      assertContent: expectText("DISABLED"),
    },
  ],
  v322: [
    {
      identifier: "app.saleor.adyen_staging",
      name: "Adyen",
      heading: "Adyen",
      assertContent: expectText("No Adyen configurations added."),
    },
    {
      identifier: "saleor.app.avatax_staging",
      name: "AvaTax",
      heading: "Configuration",
      assertContent: expectText("No configurations created yet"),
    },
    {
      identifier: "saleor.app.cms2",
      name: "CMS",
      heading: "Saleor App CMS",
      assertContent: expectText("No configurations yet"),
    },
    {
      identifier: "saleor.app.klaviyo",
      name: "Klaviyo",
      heading: "Configuration",
      assertContent: expectInputValue("PUBLIC_TOKEN", "test_token"),
    },
    {
      identifier: "saleor.app.dummy.tax",
      name: "Dummy Tax",
      heading: "Welcome to Saleor Dummy Tax App",
      assertContent: expectText("See what your app can do"),
    },
    {
      identifier: "saleor.app.search",
      name: "Search",
      heading: "Configuration",
      assertContent: expectText("DISABLED"),
    },
    {
      identifier: "saleor.app.smtp",
      name: "SMTP",
      heading: "Configuration",
      assertContent: expectText("Saleor Cloud SMTP available"),
    },
    {
      identifier: "saleor.app.payment.np-atobarai",
      name: "NP Atobarai",
      heading: "Configuration",
      assertContent: expectText("No configurations found"),
    },
    {
      identifier: "saleor.app.product-feed",
      name: "Product Feed",
      heading: "Configuration",
      assertContent: expectInputValue(
        "Title template",
        "{{variant.product.name}} - {{variant.name}}",
      ),
    },
    {
      identifier: "saleor.app.payment.stripe",
      name: "Stripe",
      heading: "Configuration",
      assertContent: expectText("No configurations found"),
    },
    {
      identifier: "saleor.app.segment-v2",
      name: "Segment",
      heading: "Configuration",
      assertContent: expectText("DISABLED"),
    },
  ],
};

export function getVersionFromBaseUrl(baseUrl: string): string {
  const match = baseUrl.match(/v(\d{3})\./);

  return match ? `v${match[1]}` : "";
}

export function getAppsForCurrentEnv(): { version: string; apps: AppSmokeEntry[] } {
  const baseUrl = process.env.BASE_URL || "";
  const version = getVersionFromBaseUrl(baseUrl);
  const allApps = APP_SMOKE_DATA[version] || [];
  const identifiersEnv = process.env.APP_IDENTIFIERS;

  if (!identifiersEnv) {
    return { version, apps: allApps };
  }

  const identifiers = identifiersEnv.split(",").map(id => id.trim());

  return { version, apps: allApps.filter(app => identifiers.includes(app.identifier)) };
}

export function resolveAppUrl(version: string, appId: string): string {
  if (version === "v320") {
    return `apps/${appId}/app`;
  }

  return `extensions/app/${encodeURIComponent(appId)}`;
}
