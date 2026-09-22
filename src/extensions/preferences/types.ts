export type ExtensionPreferenceState = "pinned" | "hidden";

export type ResolvedPreferenceState = ExtensionPreferenceState | "default";

export type ExtensionPreferencesMap = Record<string, ExtensionPreferenceState>;

export interface PreferenceKeyInput {
  id: string;
  identifier?: string | null;
  app: {
    id: string;
    identifier?: string | null;
  };
}
