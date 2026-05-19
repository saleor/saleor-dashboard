import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import { type UserPermissionFragment } from "@dashboard/graphql";

export interface HomeExtensionsSplit {
  fullscreen: Extension[];
  widgets: Extension[];
}

export const filterHomeExtensions = (
  extensions: Extension[],
  userPermissions: UserPermissionFragment[],
): HomeExtensionsSplit => {
  const result: HomeExtensionsSplit = { fullscreen: [], widgets: [] };

  for (const extension of extensions) {
    if (extension.mountName !== "HOMEPAGE_WIDGETS") {
      continue;
    }

    if (!hasPermissions(userPermissions, extension.permissions)) {
      continue;
    }

    if (!extension.url || (!isUrlAbsolute(extension.url) && !extension.app.appUrl)) {
      continue;
    }

    const settings = appExtensionManifestOptionsSchema.safeParse(extension.settings);
    const fullscreen = settings.success
      ? (settings.data.homeWidgetTarget?.fullscreen ?? false)
      : false;

    if (fullscreen) {
      result.fullscreen.push(extension);
    } else {
      result.widgets.push(extension);
    }
  }

  return result;
};
