import { z } from "zod";

const httpMethodSchema = z
  .enum(["GET", "POST"], { message: "Method must be either GET or POST" })
  .default("GET");

const widgetTargetDisplaySchema = z
  .enum(["BLOCK", "INLINE"], { message: "Style must be either INLINE or BLOCK" })
  .default("BLOCK");

const newTabTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
});

const widgetTargetOptionsSchema = z.object({
  method: httpMethodSchema.optional().nullable(),
  display: widgetTargetDisplaySchema.optional().nullable(),
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
      display: "BLOCK",
    },
  });

export type AppExtensionManifestOptions = z.infer<typeof appExtensionManifestOptionsSchema>;
