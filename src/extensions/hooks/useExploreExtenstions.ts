import { ExtensionData, ExtensionGroup } from "@dashboard/extensions/types";

// TODO: Replace mock with real data
export const useExploreExtensions = (): Record<ExtensionGroup, ExtensionData[]> => {
  return {
    payment: [
      {
        type: "APP",
        id: "app.saleor.adyen",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/contentful.png",
          dark: "https://apps.staging.saleor.io/apps/v2/contentful.png",
        },
        name: "Adyen",
        description: {
          en: "Simplify your payment process and offer a seamless online shopping experience with Adyen's payment integration for Saleor.",
        },
        repositoryUrl: "https://github.com/saleor/saleor",
        manifestUrl: "https://adyen.saleor.app/api/manifest",
      },
      {
        type: "APP",
        id: "app.saleor.adyen2",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/contentful.png",
          dark: "https://apps.staging.saleor.io/apps/v2/contentful.png",
        },
        name: "Adyen",
        description: {
          en: "Simplify your payment process and offer a seamless online shopping experience with Adyen's payment integration for Saleor.",
        },
        repositoryUrl: "https://github.com/saleor/saleor",
        manifestUrl: "https://adyen.saleor.app/api/manifest",
      },
      {
        type: "APP",
        id: "app.saleor.adyen3",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/contentful.png",
          dark: "https://apps.staging.saleor.io/apps/v2/contentful.png",
        },
        name: "Adyen",
        description: {
          en: "Simplify your payment process and offer a seamless online shopping experience with Adyen's payment integration for Saleor.",
        },
        repositoryUrl: "https://github.com/saleor/saleor",
        manifestUrl: "https://adyen.saleor.app/api/manifest",
      },
      {
        type: "APP",
        id: "app.saleor.adyen4",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/contentful.png",
          dark: "https://apps.staging.saleor.io/apps/v2/contentful.png",
        },
        name: "Adyen",
        description: {
          en: "Simplify your payment process and offer a seamless online shopping experience with Adyen's payment integration for Saleor.",
        },
        repositoryUrl: "https://github.com/saleor/saleor",
        manifestUrl: "https://adyen.saleor.app/api/manifest",
      },
    ],
    taxes: [
      {
        type: "APP",
        id: "app.saleor.avatax",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/payloadcms.png",
          dark: "https://apps.staging.saleor.io/apps/v2/payloadcms.png",
        },
        name: "AvaTax",
        description: {
          en: "AvaTax App allows dynamic tax calculations for orders and checkouts.",
        },
        repositoryUrl: "https://github.com/saleor/apps",
        manifestUrl: "https://avatax.saleor.app/api/manifest",
      },
      {
        type: "PLUGIN",
        id: "app.saleor.braintree",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/payloadcms.png",
          dark: "https://apps.staging.saleor.io/apps/v2/payloadcms.png",
        },
        name: "BrainTree",
        description: {
          en: "AvaTax App allows dynamic tax calculations for orders and checkouts.",
        },
      },
    ],
    cms: [
      {
        type: "APP",
        id: "app.saleor.cms",
        kind: "OFFICIAL",
        logo: {
          light: "https://apps.staging.saleor.io/apps/v2/contentful.png",
          dark: "https://apps.staging.saleor.io/apps/v2/contentful.png",
        },
        name: "Contentful CMS",
        description: {
          en: "CMS App is a multi-integration app that connects Saleor with popular Content Management Systems.",
        },
        repositoryUrl: "https://github.com/saleor/apps",
        manifestUrl: "https://cms-v2.saleor.app/api/manifest",
      },
    ],
  };
};
