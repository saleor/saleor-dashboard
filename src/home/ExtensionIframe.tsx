import { SaleorThrobber } from "@dashboard/components/Throbber";
import { APP_VERSION } from "@dashboard/config";
import { IframePost } from "@dashboard/extensions/components/IframePost/IframePost";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { Box, Skeleton } from "@saleor/macaw-ui-next";

interface ExtensionIframeProps {
  extension: Extension;
  height: string | number;
  loaderType?: "skeleton" | "throbber";
}

export const ExtensionIframe = ({
  extension,
  height,
  loaderType = "skeleton",
}: ExtensionIframeProps) => {
  if (extension.fromCache) {
    // Snapshot extension has no real access token yet — show a loader and wait
    // for the background revalidation before handing anything to appBridge.
    return (
      <Box
        position="relative"
        width="100%"
        height="100%"
        display={loaderType === "throbber" ? "flex" : "block"}
        alignItems={loaderType === "throbber" ? "center" : undefined}
        justifyContent={loaderType === "throbber" ? "center" : undefined}
      >
        {loaderType === "throbber" ? <SaleorThrobber /> : <Skeleton __height={height} />}
      </Box>
    );
  }

  const settings = appExtensionManifestOptionsSchema.safeParse(extension.settings);
  const method = settings.success ? (settings.data.homeWidgetTarget?.method ?? "POST") : "POST";
  const extensionUrl = isUrlAbsolute(extension.url)
    ? extension.url
    : `${extension.app.appUrl}${extension.url}`;

  if (method === "POST") {
    return (
      <Box position="relative" width="100%" height="100%">
        <IframePost
          appId={extension.app.id}
          accessToken={extension.accessToken}
          extensionId={extension.id}
          extensionUrl={extensionUrl}
          height={height}
          loaderType={loaderType}
        />
      </Box>
    );
  }

  return (
    <Box position="relative" __lineHeight={0} width="100%" height="100%">
      <AppFrame
        target="WIDGET"
        src={extensionUrl}
        appToken={extension.accessToken}
        appId={extension.app.id}
        dashboardVersion={APP_VERSION}
      />
    </Box>
  );
};
