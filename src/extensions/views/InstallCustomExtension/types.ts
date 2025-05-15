import { AppManifestFragment } from "@dashboard/graphql";

export type Manifest = AppManifestFragment;
export { ExtensionInstallFormData } from "./schema";

export type InstallDetailsManifestData = Pick<
  AppManifestFragment,
  "name" | "brand" | "permissions" | "dataPrivacyUrl"
>;
