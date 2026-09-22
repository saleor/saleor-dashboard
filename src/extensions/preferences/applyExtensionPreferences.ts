import { type PreferenceKeyInput, type ResolvedPreferenceState } from "./types";

export const applyExtensionPreferences = <T extends PreferenceKeyInput>(
  extensions: T[],
  getState: (extension: PreferenceKeyInput) => ResolvedPreferenceState,
): T[] => {
  const visible = extensions.filter(extension => getState(extension) !== "hidden");

  const pinned = visible.filter(extension => getState(extension) === "pinned");
  const rest = visible.filter(extension => getState(extension) !== "pinned");

  return [...pinned, ...rest];
};
