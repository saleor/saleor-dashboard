import { appsListPath } from "@saleor/apps/urls";
import { Backlink } from "@saleor/components/Backlink";
import Container from "@saleor/components/Container";
import { AppQuery } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Backlink href={appsListPath}>
        {intl.formatMessage(sectionNames.apps)}
      </Backlink>
      <div className={classes.iframeContainer}>
        {url && (
          <AppFrame
            src={url}
            appToken={data?.accessToken ?? ""}
            onError={onError}
            appId={data?.id ?? ""}
            refetch={refetch}
          />
        )}
      </div>
    </Container>
  );
};

AppPage.displayName = "AppPage";
export default AppPage;
