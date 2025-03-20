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
}

interface AppExtensionData extends CommonExtensionData {
  type: "APP";
  kind: "OFFICIAL" | "OSS";
  manifestUrl: string | null;
  repostitoryUrl: string | null; // Typo in the original code
}

interface PluginExtensionData extends CommonExtensionData {
  type: "PLUGIN";
}

export type ExtensionData = AppExtensionData | PluginExtensionData;

export type ExtensionGroup = "payment" | "taxes" | "cms";

export type ExtensionsGroups = Record<ExtensionGroup, ExtensionData[]>;
