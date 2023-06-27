// @ts-strict-ignore
import { AppUrls } from "@dashboard/apps/urls";
import {
  borderHeight,
  topBarHeight,
} from "@dashboard/components/AppLayout/consts";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { AppQuery } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui/next";
import React from "react";

import { AppFrame } from "../AppFrame";
import { AppPageNav } from "./AppPageNav";

export interface AppPageProps {
  data: AppQuery["app"];
  url: string;
  onError: () => void;
  refetch?: () => void;
}

export const AppPage: React.FC<AppPageProps> = ({
  data,
  url,
  onError,
  refetch,
}) => (
  <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
    <AppPageNav
      goBackUrl={AppUrls.resolveAppListUrl()}
      appId={data.id}
      name={data?.name}
      supportUrl={data?.supportUrl}
      homepageUrl={data?.homepageUrl}
      author={data?.author}
      appLogoUrl={data?.brand?.logo.default}
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
            src={url}
            appToken={data?.accessToken ?? ""}
            onError={onError}
            appId={data?.id ?? ""}
            refetch={refetch}
          />
        )}
      </Box>
    </DetailPageLayout.Content>
  </DetailPageLayout>
);

AppPage.displayName = "AppPage";
export default AppPage;
