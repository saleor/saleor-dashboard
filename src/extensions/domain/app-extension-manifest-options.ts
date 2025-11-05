import { z } from "zod";

const httpMethodSchema = z
  .enum(["GET", "POST"], { message: "Method must be either GET or POST" })
  .default("GET");

const newTabTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
});

const widgetTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
});

export const appExtensionManifestOptionsSchema = z
  .object({
    newTabTarget: newTabTargetOptionsSchema.optional().nullable(),
    widgetTarget: widgetTargetOptionsSchema.optional().nullable(),
  })
  .refine(
    data => {
      // Only one of newTabTarget or widgetTarget can be set
      return !(data.newTabTarget && data.widgetTarget);
    },
    {
      message: "Only one of 'newTabTarget' or 'widgetTarget' can be set.",
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

export type AppExtensionManifestOptions = z.infer<typeof appExtensionManifestOptionsSchema>;
