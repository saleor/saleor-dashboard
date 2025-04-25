import { ReactNode } from "react";

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

export type ExtensionGroup = "payments" | "taxes" | "cms" | "automation";

export type ExtensionsGroups = Record<ExtensionGroup, { title: string; items: ExtensionData[] }>;

export type APIExtensionsResponse = Array<{
  id: string;
  name: { en: string };
  extensions: ExtensionData[];
}>;

export type InstalledExtension = {
  id: string;
  name: string;
  logo: string;
  info: ReactNode;
  actions: ReactNode;
};
