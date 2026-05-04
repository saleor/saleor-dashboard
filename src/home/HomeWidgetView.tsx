import { borderHeight, topBarHeight } from "@dashboard/components/AppLayout/consts";
import { APP_VERSION } from "@dashboard/config";
import { IframePost } from "@dashboard/extensions/components/IframePost/IframePost";
import { appExtensionManifestOptionsSchema } from "@dashboard/extensions/domain/app-extension-manifest-options";
import { isUrlAbsolute } from "@dashboard/extensions/isUrlAbsolute";
import { type Extension } from "@dashboard/extensions/types";
import { AppFrame } from "@dashboard/extensions/views/ViewManifestExtension/components/AppFrame/AppFrame";
import { Box, Text } from "@saleor/macaw-ui-next";

interface HomeWidgetViewProps {
  extension: Extension;
}

const fullscreenHeight = `calc(100vh - ${borderHeight} - ${topBarHeight})`;

export const HomeWidgetView = ({ extension }: HomeWidgetViewProps) => {
  const settings = appExtensionManifestOptionsSchema.safeParse(extension.settings);
  const method = settings.success ? (settings.data.homeWidget?.method ?? "POST") : "POST";
  const isAbsolute = isUrlAbsolute(extension.url);
  const extensionUrl = isAbsolute ? extension.url : `${extension.app.appUrl ?? ""}${extension.url}`;

  if (!extensionUrl) {
    return (
      <Box padding={6}>
        <Text>Extension URL is not configured.</Text>
      </Box>
    );
  }

  if (method === "POST") {
    return (
      <Box position="relative" __height={fullscreenHeight} __minHeight={fullscreenHeight}>
        <IframePost
          appId={extension.app.id}
          accessToken={extension.accessToken}
          extensionId={extension.id}
          extensionUrl={extensionUrl}
          height="100%"
        />
      </Box>
    );
  }

  return (
    <Box position="relative" __lineHeight={0} height="100%" __minHeight={fullscreenHeight}>
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
