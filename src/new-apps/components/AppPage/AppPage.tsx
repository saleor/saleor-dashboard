import { DetailPageLayout } from "@dashboard/components/Layouts";
import { AppQuery } from "@dashboard/graphql";
import React from "react";

import { AppFrame } from "../AppFrame";
import { AppPageNav } from "./AppPageNav";
import { useStyles } from "./styles";

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
}) => {
  const classes = useStyles();

  return (
    <DetailPageLayout gridTemplateColumns={1} withSavebar={false}>
      <AppPageNav
        name={data?.name}
        supportUrl={data?.supportUrl}
        homepageUrl={data?.homepageUrl}
      />
      <DetailPageLayout.Content>
        <div className={classes.iframeContainer}>
          {url && data?.id && data?.accessToken && (
            <AppFrame
              src={url}
              appToken={data?.accessToken ?? ""}
              onError={onError}
              appId={data?.id ?? ""}
              refetch={refetch}
            />
          )}
        </div>
      </DetailPageLayout.Content>
    </DetailPageLayout>
  );
};

AppPage.displayName = "AppPage";
export default AppPage;
