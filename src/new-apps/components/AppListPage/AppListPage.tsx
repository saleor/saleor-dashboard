import { Typography } from "@material-ui/core";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { AppListItemFragment } from "@saleor/graphql";
import { sectionNames } from "@saleor/intl";
import { Button } from "@saleor/macaw-ui";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AllAppList from "../AllAppList";
import InstalledAppList from "../InstalledAppList";
import { messages } from "./messages";
import { useStyles } from "./styles";

export interface AppListPageProps {
  marketplaceAppList?: GetV2SaleorAppsResponse.SaleorApp[];
  installedAppList?: AppListItemFragment[];
}

export const AppListPage: React.FC<AppListPageProps> = ({
  marketplaceAppList,
  installedAppList,
}) => {
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)}>
        <Button variant="secondary" data-test-id="install-external-app-button">
          <FormattedMessage {...messages.installExternalApp} />
        </Button>
      </PageHeader>
      <Typography variant="body1">
        <FormattedMessage {...messages.installAppDescription} />
      </Typography>
      <div className={classes.appContent}>
        <Typography variant="h3" className={classes.sectionHeader}>
          <FormattedMessage {...messages.installedApps} />
        </Typography>
        <InstalledAppList appList={installedAppList} />
        <Typography variant="h3" className={classes.sectionHeader}>
          <FormattedMessage {...messages.allApps} />
        </Typography>
        <AllAppList appList={marketplaceAppList} />
      </div>
    </Container>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
