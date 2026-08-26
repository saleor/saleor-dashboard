import {
  type ExtensionPreferencesMap,
  type ExtensionPreferenceState,
  type ResolvedPreferenceState,
} from "./types";

const isPreferenceState = (value: unknown): value is ExtensionPreferenceState =>
  value === "pinned" || value === "hidden";

export const parseExtensionPreferences = (
  rawValue: string | undefined | null,
): ExtensionPreferencesMap => {
  if (!rawValue) {
    return {};
  }

  try {
    const parsed: unknown = JSON.parse(rawValue);

    if (typeof parsed !== "object" || parsed === null) {
      return {};
    }

    const result: ExtensionPreferencesMap = {};

    for (const [key, value] of Object.entries(parsed)) {
      if (isPreferenceState(value)) {
        result[key] = value;
      }
    }

    return result;
  } catch {
    return {};
  }
};

export const serializeExtensionPreferences = (map: ExtensionPreferencesMap): string =>
  JSON.stringify(map);

export const setPreferenceInMap = (
  map: ExtensionPreferencesMap,
  key: string,
  next: ResolvedPreferenceState,
): ExtensionPreferencesMap => {
  const result: ExtensionPreferencesMap = { ...map };

  if (next === "default") {
    delete result[key];
  } else {
    result[key] = next;
  }

  return result;
};
