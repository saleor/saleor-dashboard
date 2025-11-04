import { borderHeight, topBarHeight } from "@dashboard/components/AppLayout/consts";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { APP_VERSION } from "@dashboard/config";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { AppQuery } from "@dashboard/graphql";
import useShop from "@dashboard/hooks/useShop";
import { Box } from "@saleor/macaw-ui-next";

import { AppFrame } from "../AppFrame/AppFrame";
import { AppPageNav } from "./AppPageNav";

interface AppPageProps {
  data: AppQuery["app"];
  url: string;
  onError: () => void;
  refetch?: () => void;
}

export const AppPage = ({ data, url, onError, refetch }: AppPageProps) => {
  const shop = useShop();

  /**
   * TODO Make some loading state
   */
  if (!shop?.version) {
    return null;
  }

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <AppPageNav
        appId={data?.id || ""}
        name={data?.name}
        supportUrl={data?.supportUrl}
        homepageUrl={data?.homepageUrl}
        author={data?.author}
        appLogoUrl={data?.brand?.logo.default}
        showMangeAppButton={true}
        goBackUrl={ExtensionsUrls.resolveInstalledExtensionsUrl()}
      />
      <DetailPageLayout.Content>
        <Box
          position="relative"
          // It removes extra space between iframe and container
          __lineHeight={0}
          height="100%"
          __minHeight={`calc(100vh - ${borderHeight} - ${topBarHeight})`}
        >
          {url && data?.id && data?.accessToken && (
            <AppFrame
              target="APP_PAGE"
              src={url}
              appToken={data?.accessToken ?? ""}
              onError={onError}
              appId={data?.id ?? ""}
              refetch={refetch}
              coreVersion={shop.version}
              dashboardVersion={APP_VERSION}
            />
          )}
        </Box>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

AppPage.displayName = "AppPage";
