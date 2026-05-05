import { appExtensionManifest } from "@dashboard/extensions/domain/app-extension-manifest";
import { permissionSchema } from "@dashboard/extensions/domain/permission";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { z } from "zod";

// For now contains only partial fields, because Saleor is validating manifest anyway.
// Subset here serves only fields needed for dashboard extensions.
export const appManifestSchema = z
  .object({
    appUrl: z.string().optional().nullable(),
    permissions: z.array(permissionSchema).optional().default([]),
    extensions: z.array(appExtensionManifest).optional().default([]),
  })
  .refine(
    data => {
      return data.extensions.every(ext => {
        if (!isUrlAbsolute(ext.url)) {
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
          data.permissions.find(perm => perm.code === extPerm.code),
        );
      });
    },
    {
      message: "Extension permission must be listed in App's permissions.",
    },
  );

export type AppManifest = z.infer<typeof appManifestSchema>;
