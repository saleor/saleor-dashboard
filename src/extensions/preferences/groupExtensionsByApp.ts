import { type Extension } from "@dashboard/extensions/types";

interface ExtensionAppGroup {
  app: Extension["app"];
  extensions: Extension[];
}

export const groupExtensionsByApp = (extensions: Extension[]): ExtensionAppGroup[] => {
  const groups = new Map<string, ExtensionAppGroup>();

  for (const extension of extensions) {
    const existing = groups.get(extension.app.id);

    if (existing) {
      existing.extensions.push(extension);
    } else {
      groups.set(extension.app.id, { app: extension.app, extensions: [extension] });
    }
  }

  return [...groups.values()].sort((a, b) => (a.app.name ?? "").localeCompare(b.app.name ?? ""));
};
