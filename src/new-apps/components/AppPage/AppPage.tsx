import { DetailedContent } from "@dashboard/components/AppLayout/DetailedContent";
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
    <DetailedContent useSingleColumn>
      <AppPageNav
        name={data?.name}
        supportUrl={data?.supportUrl}
        homepageUrl={data?.homepageUrl}
      />

      <div className={classes.iframeContainer}>
        {url && data.id && data.accessToken && (
          <AppFrame
            src={url}
            appToken={data?.accessToken ?? ""}
            onError={onError}
            appId={data?.id ?? ""}
            refetch={refetch}
          />
        )}
      </div>
    </DetailedContent>
  );
};

AppPage.displayName = "AppPage";
export default AppPage;
