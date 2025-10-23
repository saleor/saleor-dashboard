import { z } from "zod";

export const AppExtensionManifestTarget = z.enum(["POPUP", "APP_PAGE", "NEW_TAB", "WIDGET"]);
export type AppExtensionManifestTarget = z.infer<typeof AppExtensionManifestTarget>;
