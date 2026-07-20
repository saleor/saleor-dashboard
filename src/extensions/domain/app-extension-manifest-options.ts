import { z } from "zod";

import { AppExtensionViews } from "./app-extension-manifest-views";

const httpMethodSchema = z
  .enum(["GET", "POST"], { message: "Method must be either GET or POST" })
  .default("GET");

const newTabTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
});

const widgetTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
});

const homeWidgetTargetOptionsSchema = z.object({
  method: z.enum(["GET", "POST"], { message: "Method must be either GET or POST" }).default("POST"),
  fullscreen: z.boolean().default(false),
});

export const appExtensionManifestOptionsSchema = z
  .object({
    newTabTarget: newTabTargetOptionsSchema.optional().nullable(),
    widgetTarget: widgetTargetOptionsSchema.optional().nullable(),
    homeWidgetTarget: homeWidgetTargetOptionsSchema.optional().nullable(),
    // Only valid on the SEARCH_ACTION mount (enforced in app-extension-manifest.ts).
    // Absent/null = render in every view; when provided must name at least one view.
    views: z
      .array(AppExtensionViews, {
        message: "views must be an array of valid view names",
      })
      .min(1, { message: "views must contain at least one view when provided" })
      .optional()
      .nullable(),
  })
  .refine(
    data => {
      // Only one of newTabTarget or widgetTarget can be set
      return !(data.newTabTarget && data.widgetTarget);
    },
    {
      message: "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
    },
  )
  .refine(
    data => {
      if (data.homeWidgetTarget && (data.newTabTarget || data.widgetTarget)) {
        return false;
      }

      return true;
    },
    {
      message: "When 'homeWidgetTarget' is set, 'newTabTarget' and 'widgetTarget' cannot be set.",
    },
  );

export const appExtensionManifestOptionsSchemaWithDefault =
  appExtensionManifestOptionsSchema.default({
    newTabTarget: {
      method: "GET",
    },
    widgetTarget: {
      method: "POST",
    },
  });
