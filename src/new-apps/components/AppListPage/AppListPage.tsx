import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { GetV2SaleorAppsResponse } from "@saleor/new-apps/marketplace.types";
import React from "react";
import { useIntl } from "react-intl";

import AppListContent from "../AppListContent";

export interface AppListPageProps {
  appList?: GetV2SaleorAppsResponse.SaleorApp[];
}

export const AppListPage: React.FC<AppListPageProps> = ({ appList }) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
      <AppListContent appList={appList} />
    </Container>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
