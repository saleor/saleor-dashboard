import { type AppFetchMutation, type AppFetchMutationVariables } from "@dashboard/graphql";

export type Manifest = NonNullable<AppFetchMutation["appFetchManifest"]>["manifest"];
export type ExtensionInstallFormData = AppFetchMutationVariables;
