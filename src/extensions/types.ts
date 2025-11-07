import { AllAppExtensionMounts } from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { ExtensionListQuery, PermissionEnum } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { ReactNode } from "react";

import { AppDetailsUrlMountQueryParams } from "./urls";

interface CommonExtensionData {
  id: string;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  logo: {
    light: {
      source: string;
    };
    dark: {
      source: string;
    };
  };
  installed?: boolean;
  disabled?: boolean;
}

interface AppExtensionData extends CommonExtensionData {
  type: "APP";
  kind: "OFFICIAL" | "OSS";
  manifestUrl: string | null;
  repositoryUrl: string | null; // Typo in the original code
  isCustomApp?: boolean;
  appId?: string;
}

interface PluginExtensionData extends CommonExtensionData {
  type: "PLUGIN";
}

export type ExtensionData = AppExtensionData | PluginExtensionData;

type ExtensionGroup = "payments" | "taxes" | "cms" | "automation";

export type ExtensionsGroups = Record<ExtensionGroup, { title: string; items: ExtensionData[] }>;

export type APIExtensionsResponse = Array<{
  id: string;
  name: { en: string };
  extensions: ExtensionData[];
}>;

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
