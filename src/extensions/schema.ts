import { z } from "zod";

const localizedStringSchema = z.object({
  en: z.string(),
});

const logoSchema = z.object({
  light: z.object({ source: z.string() }),
  dark: z.object({ source: z.string() }),
});

const commonExtensionFields = {
  id: z.string(),
  name: localizedStringSchema,
  description: localizedStringSchema.nullable(),
  logo: logoSchema,
  installed: z.boolean().optional(),
  disabled: z.boolean().optional(),
};

const appExtensionDataSchema = z.object({
  ...commonExtensionFields,
  type: z.literal("APP"),
  kind: z.enum(["OFFICIAL", "PARTNER", "OSS"]),
  manifestUrl: z.string().nullable(),
  repositoryUrl: z.string().nullable(),
  isCustomApp: z.boolean().optional(),
  appId: z.string().optional(),
});

const pluginExtensionDataSchema = z.object({
  ...commonExtensionFields,
  type: z.literal("PLUGIN"),
});

export const extensionDataSchema = z.discriminatedUnion("type", [
  appExtensionDataSchema,
  pluginExtensionDataSchema,
]);

export const extensionCategorySchema = z.object({
  id: z.string(),
  name: localizedStringSchema,
  extensions: z.array(extensionDataSchema),
});

export const extensionsResponseSchema = z.object({
  extensionCategories: z.array(extensionCategorySchema),
});

export type ExtensionData = z.infer<typeof extensionDataSchema>;
export type ExtensionCategory = z.infer<typeof extensionCategorySchema>;
