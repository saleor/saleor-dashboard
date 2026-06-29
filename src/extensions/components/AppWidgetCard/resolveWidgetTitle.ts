import { type AppWidgetCardExtension } from "./appWidgetCardExtension";

export const resolveWidgetTitle = (
  extension: AppWidgetCardExtension,
  fallbackTitle: string,
): string => {
  const label = extension.label.trim();

  if (label) {
    return label;
  }

  const appName = extension.app.name?.trim();

  if (appName) {
    return appName;
  }

  return fallbackTitle;
};
