import { appExtensionManifest } from "@dashboard/extensions/domain/app-extension-manifest";
import { z } from "zod";

// For now contains only partial fields, because Saleor is validating manifest anyway.
// Subset here serves only fields needed for dashboard extensions.
export const appManifestSchema = z
  .object({
    appUrl: z.string().optional(),
    permissions: z
      .array(
        z.object({
          code: z.string(),
        }),
      )
      .optional()
      .default([]),
    extensions: z.array(appExtensionManifest).optional().default([]),
  })
  .refine(
    data => {
      // Validate extension URLs require appUrl for certain cases
      return data.extensions.every(ext => {
        if (ext.url.startsWith("/") && ext.target === "NEW_TAB") {
          return !!data.appUrl;
        }

        return true;
      });
    },
    {
      message: "To use relative URL, you must specify appUrl.",
    },
  )
  .refine(
    data => {
      // Validate extension permissions are subset of app permissions
      return data.extensions.every(ext => {
        return ext.permissions.every(extPerm =>
          data.permissions.find(perm => perm.code === extPerm),
        );
      });
    },
    {
      message: "Extension permission must be listed in App's permissions.",
    },
  );

export type AppManifest = z.infer<typeof appManifestSchema>;
