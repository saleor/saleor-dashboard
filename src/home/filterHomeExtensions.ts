import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { type Extension } from "@dashboard/extensions/types";
import { type UserPermissionFragment } from "@dashboard/graphql";

export const filterHomeExtensions = (
  extensions: Extension[],
  userPermissions: UserPermissionFragment[],
): Extension[] =>
  extensions.filter(extension => {
    if (extension.mountName !== "HOMEPAGE_WIDGETS") {
      return false;
    }

    if (!hasPermissions(userPermissions, extension.permissions)) {
      return false;
    }

    // fullscreen defaults to true when homeWidget is omitted or settings can't be parsed -
    // extensions without explicit homeWidget config are still considered fullscreen home widgets
    const settings = appExtensionManifestOptionsSchema.safeParse(extension.settings);
    const fullscreen = settings.success ? (settings.data.homeWidget?.fullscreen ?? true) : true;

    return fullscreen;
  });
