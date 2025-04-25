import { type AppFetchMutationVariables, AppManifestFragment } from "@dashboard/graphql";

export type Manifest = AppManifestFragment;
export type ExtensionInstallFormData = AppFetchMutationVariables;

export type InstallDetailsManifestData = Pick<
  AppManifestFragment,
  "name" | "brand" | "permissions" | "dataPrivacyUrl"
>;
