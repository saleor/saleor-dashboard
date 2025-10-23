import { z } from "zod";

const httpMethodSchema = z.enum(["GET", "POST"], { message: "Method must be either GET or POST" });

const newTabTargetOptionsSchema = z.object({
  method: httpMethodSchema,
});

const widgetTargetOptionsSchema = z.object({
  method: httpMethodSchema,
});

export const appExtensionManifestOptionsSchema = z
  .object({
    newTabTarget: newTabTargetOptionsSchema.optional(),
    widgetTarget: widgetTargetOptionsSchema.optional(),
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

export type AppExtensionManifestOptions = z.infer<typeof appExtensionManifestOptionsSchema>;
