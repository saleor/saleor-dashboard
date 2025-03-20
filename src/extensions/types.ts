interface CommonExtensionData {
  name: string;
  logo?: {
    light: string;
    dark: string;
  };
  id: string;
  description?: {
    en: string;
    [languageKey: string]: string;
  };
}

interface AppExtensionData extends CommonExtensionData {
  type: "APP";
  manifestUrl: string | null;
  repositoryUrl: string | null;
  kind: "OFFICIAL" | "OSS";
}

interface PluginExtensionData extends CommonExtensionData {
  type: "PLUGIN";
}

export type ExtensionData = AppExtensionData | PluginExtensionData;

export type ExtensionGroup = "payment" | "taxes" | "cms";
