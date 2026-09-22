import { type PreferenceKeyInput } from "./types";

export const getExtensionPreferenceKey = (extension: PreferenceKeyInput): string => {
  const appPart = extension.app.identifier ?? extension.app.id;
  const extensionPart = extension.identifier ?? extension.id;

  return `${appPart}:${extensionPart}`;
};
