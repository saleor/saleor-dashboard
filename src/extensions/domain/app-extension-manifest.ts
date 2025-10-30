import {
  ALL_APP_EXTENSION_MOUNTS,
  WIDGET_AVAILABLE_MOUNTS,
} from "@dashboard/extensions/domain/app-extension-manifest-available-mounts";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { AppExtensionManifestTarget } from "@dashboard/extensions/domain/app-extension-manifest-target";
import { z } from "zod";

export const appExtensionManifest = z
  .object({
    label: z.string().min(1),
    url: z.string().min(1),
    mount: ALL_APP_EXTENSION_MOUNTS,
    target: AppExtensionManifestTarget.default("POPUP"),
    permissions: z.array(z.string()).optional().default([]),
    options: appExtensionManifestOptionsSchema.optional(),
  })
  .refine(
    data => {
      // Validate that WIDGET target only uses widget-compatible mounts
      if (data.target === "WIDGET") {
        return WIDGET_AVAILABLE_MOUNTS.includes(data.mount as any);
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
      if (data.options?.widgetTarget && data.target !== "WIDGET") {
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
      if (data.options?.newTabTarget && data.target !== "NEW_TAB") {
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
      const target = data.target;

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
