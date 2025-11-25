import {
  ALL_APP_EXTENSION_MOUNTS,
  WIDGET_AVAILABLE_MOUNTS,
} from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { permissionSchema } from "@dashboard/extensions/domain/permission";
import { z } from "zod";

export const appExtensionManifest = z
  .object({
    label: z.string().min(1),
    url: z.string().min(1),
    mountName: ALL_APP_EXTENSION_MOUNTS,
    targetName: AppExtensionManifestTarget.default("POPUP"),
    permissions: z.array(permissionSchema).optional().default([]),
    options: appExtensionManifestOptionsSchema.optional(),
  })
  .refine(
    data => {
      // Validate that WIDGET target only uses widget-compatible mounts
      if (data.targetName === "WIDGET") {
        return WIDGET_AVAILABLE_MOUNTS.includes(data.mountName as any);
      }

      return true;
    },
    {
      message: "Mount is not available for WIDGET target.",
    },
  )
  .refine(
    data => {
      // Validate widgetTarget options only on WIDGET target
      if (data.options?.widgetTarget && data.targetName !== "WIDGET") {
        return false;
      }

      return true;
    },
    {
      message: "widgetTarget options must be set only on WIDGET target",
    },
  )
  .refine(
    data => {
      // Validate newTabTarget options only on NEW_TAB target
      if (data.options?.newTabTarget && data.targetName !== "NEW_TAB") {
        return false;
      }

      return true;
    },
    {
      message: "newTabTarget options must be set only on NEW_TAB target",
    },
  )
  .refine(
    data => {
      // URL validation based on target
      const url = data.url;
      const target = data.targetName;

      const isAppPage = target === "APP_PAGE";
      const isRelativeUrl = url.startsWith("/");

      if (isAppPage && !isRelativeUrl) {
        return false;
      }

      return true;
    },
    {
      message: `APP_PAGE type of extension must start with "/"`,
    },
  );

export type AppExtensionManifest = z.infer<typeof appExtensionManifest>;
