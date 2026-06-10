import { type InstallDetailsManifestData } from "@dashboard/extensions/views/InstallCustomExtension/types";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ZodIssueCode } from "zod";

import { InstallExtensionManifestData } from "./InstallExtensionManifestData";

const manifest: InstallDetailsManifestData = {
  name: "Acme Analytics",
  brand: {
    __typename: "AppManifestBrand",
    logo: { __typename: "AppManifestBrandLogo", default: "https://placehold.co/64x64/png" },
  },
  permissions: [
    { __typename: "Permission", code: "MANAGE_ORDERS" as any, name: "Manage orders" },
    { __typename: "Permission", code: "MANAGE_PRODUCTS" as any, name: "Manage products" },
  ],
  dataPrivacyUrl: "https://example.com/privacy",
};

const meta: Meta<typeof InstallExtensionManifestData> = {
  title: "Extensions/InstallCustomExtension/InstallExtensionManifestData",
  component: InstallExtensionManifestData,
  args: { manifest },
};

export default meta;
type Story = StoryObj<typeof InstallExtensionManifestData>;

export const Default: Story = {};

export const WithIssues: Story = {
  args: {
    issues: [
      {
        code: ZodIssueCode.custom,
        path: ["appUrl"],
        message: "appUrl is missing",
      },
      {
        code: ZodIssueCode.custom,
        path: ["tokenTargetUrl"],
        message: "tokenTargetUrl is not a valid URL",
      },
    ],
  },
};
