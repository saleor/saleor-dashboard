import { AppQuery } from "@dashboard/graphql";
import React from "react";

import { AppFrame } from "../AppFrame";
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
  console.log("AppPage render");

  return (
    <div className={classes.iframeContainer}>
      {url && data.id && data.accessToken && (
        <AppFrame
          src={url}
          appToken={data?.accessToken}
          onError={onError}
          appId={data?.id}
          refetch={refetch}
        />
      )}
    </div>
  );
};

AppPage.displayName = "AppPage";
