import {
  PermissionEnum,
  WebhookEventTypeAsyncEnum,
  WebhookEventTypeSyncEnum,
} from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { useInstallChecks } from "../../../hooks/useInstallChecks";
import { type Manifest } from "../../../types";
import { InstallExtensionManifestData } from "./InstallExtensionManifestData";

const manifestUrl = "https://payments.acme-apps.io/api/manifest";

const manifest: Manifest = {
  __typename: "Manifest",
  identifier: "io.acme-apps.payments",
  version: "2.4.1",
  name: "Acme Payments",
  about: "Accept card and wallet payments with Acme.",
  author: "Acme Apps Ltd",
  appUrl: "https://payments.acme-apps.io",
  tokenTargetUrl: "https://api.acme-cdn.net/register",
  dataPrivacy: null,
  dataPrivacyUrl: "https://acme-apps.io/privacy",
  deprecationReason: null,
  homepageUrl: "https://acme-apps.io",
  supportUrl: "https://acme-apps.io/support",
  requiredSaleorVersion: {
    __typename: "AppManifestRequiredSaleorVersion",
    constraint: ">=3.20",
    satisfied: true,
  },
  brand: {
    __typename: "AppManifestBrand",
    logo: { __typename: "AppManifestBrandLogo", default: "https://placehold.co/64x64/png" },
  },
  permissions: [
    { __typename: "Permission", code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
    { __typename: "Permission", code: PermissionEnum.MANAGE_USERS, name: "Manage customers" },
    { __typename: "Permission", code: PermissionEnum.MANAGE_ORDERS, name: "Manage orders" },
  ],
  extensions: [
    {
      __typename: "AppManifestExtension",
      label: "Refund with Acme",
      url: "/refund",
      mountName: "ORDER_DETAILS_MORE_ACTIONS",
      targetName: "POPUP",
      permissions: [
        { __typename: "Permission", code: PermissionEnum.HANDLE_PAYMENTS, name: "Handle payments" },
      ],
    },
  ],
  webhooks: [
    {
      __typename: "AppManifestWebhook",
      name: "Transaction initialize",
      syncEvents: [WebhookEventTypeSyncEnum.TRANSACTION_INITIALIZE_SESSION],
      asyncEvents: [],
      targetUrl: "https://payments.acme-apps.io/api/webhooks/transaction-initialize",
    },
    {
      __typename: "AppManifestWebhook",
      name: "Order fully paid",
      syncEvents: [],
      asyncEvents: [WebhookEventTypeAsyncEnum.ORDER_FULLY_PAID],
      targetUrl: "https://payments.acme-apps.io/api/webhooks/order-fully-paid",
    },
  ],
};

interface PreviewProps {
  manifest: Manifest;
  manifestUrl: string;
  /** Storybook has no Saleor app domain configured, so official apps are simulated. */
  isOfficial?: boolean;
}

const Preview = ({ manifest, manifestUrl, isOfficial }: PreviewProps) => {
  const checks = useInstallChecks({ manifest, manifestUrl });

  return (
    <InstallExtensionManifestData
      manifest={manifest}
      manifestUrl={manifestUrl}
      checks={{ ...checks, isOfficial: isOfficial ?? checks.isOfficial }}
    />
  );
};

const meta: Meta<typeof Preview> = {
  title: "Extensions/InstallCustomExtension/InstallExtensionManifestData",
  component: Preview,
  args: { manifest, manifestUrl },
};

export default meta;
type Story = StoryObj<typeof Preview>;

export const External: Story = {};

export const Official: Story = {
  args: {
    manifestUrl: "https://payments.saleor.app/api/manifest",
    isOfficial: true,
    manifest: {
      ...manifest,
      appUrl: "https://payments.saleor.app",
      tokenTargetUrl: "https://payments.saleor.app/api/register",
      webhooks: [],
    },
  },
};

export const WithIssues: Story = {
  args: {
    manifest: {
      ...manifest,
      // An extension permission missing from the app permissions fails validation.
      permissions: [],
    },
  },
};

export const Deprecated: Story = {
  args: {
    manifest: {
      ...manifest,
      deprecationReason:
        "Acme Payments is replaced by Acme Checkout. Install Acme Checkout from Extensions before the end of the year.",
    },
  },
};

export const UnsupportedSaleorVersion: Story = {
  args: {
    manifest: {
      ...manifest,
      requiredSaleorVersion: {
        __typename: "AppManifestRequiredSaleorVersion",
        constraint: ">=3.99",
        satisfied: false,
      },
    },
  },
};
