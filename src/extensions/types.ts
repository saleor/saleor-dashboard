import { type AllAppExtensionMounts } from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { type AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { type ExtensionCategory, type ExtensionData } from "@dashboard/extensions/schema";
import {
  type AppTypeEnum,
  type ExtensionListQuery,
  type InstalledAppDetailsFragment,
  type PermissionEnum,
} from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import { type ReactNode } from "react";

import { type AppDetailsUrlMountQueryParams } from "./urls";

export type GraphQLAppProblem = NonNullable<InstalledAppDetailsFragment["problems"]>[number];

export interface WebhookDeliveryProblem {
  __typename: "WebhookDeliveryError";
  message: string;
  createdAt: string;
}

export type AppProblem = GraphQLAppProblem | WebhookDeliveryProblem;

export const isProblemCritical = (problem: AppProblem): boolean => {
  if (problem.__typename === "AppProblem") {
    return problem.isCritical;
  }

  // WebhookDeliveryError is a warning, not critical
  return false;
};

export const isProblemDismissed = (problem: AppProblem): boolean => {
  if (problem.__typename === "AppProblem") {
    return problem.dismissed !== null;
  }

  return false;
};

export const getProblemSortDate = (problem: AppProblem): string => {
  if (problem.__typename === "AppProblem") {
    return problem.updatedAt;
  }

  return problem.createdAt;
};

export type { ExtensionData };

export type APIExtensionsResponse = ExtensionCategory[];

export type ExtensionsGroups = Record<string, { title: string; items: ExtensionData[] }>;

/*
  Candidate for refactoring. InstalledExtension is only one case.
  We have also pending installation, failed installation, etc. and they have different actions.
  We should create dedicated types for each case (PendingInstallation, FailedInstallation and so on)
*/
export type InstalledExtension = {
  id: string;
  name: string;
  logo: ReactNode;
  info: ReactNode;
  href?: string;
  actions?: ReactNode;
  problems?: AppProblem[];
  appType?: AppTypeEnum | null;
  isActive?: boolean | null;
  activeProblemCount: number;
  criticalProblemCount: number;
};

export interface Extension {
  id: string;
  app: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>[0]["app"];
  accessToken: string;
  permissions: PermissionEnum[];
  label: string;
  mountName: AllAppExtensionMounts;
  url: string;
  open: () => void;
  targetName: AppExtensionManifestTarget;
  settings: RelayToFlat<NonNullable<ExtensionListQuery["appExtensions"]>>[0]["settings"];
}

export interface ExtensionWithParams extends Omit<Extension, "open"> {
  open: (params: AppDetailsUrlMountQueryParams) => void;
}

export interface AppLogo {
  source?: string;
}
