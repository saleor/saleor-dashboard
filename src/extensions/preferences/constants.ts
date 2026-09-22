import { WIDGET_AVAILABLE_MOUNTS } from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";

export const EXTENSION_PREFERENCES_METADATA_KEY = "dashboard-extensions-preferences";

// Only the widget mounts are controllable in v1. Enforcement and the settings
// list are both driven off this whitelist so there are never dead toggles.
export const PREFERENCE_ENABLED_MOUNTS = WIDGET_AVAILABLE_MOUNTS;
