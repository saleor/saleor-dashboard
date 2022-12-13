import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { SaleorMarketplaceApp } from "@saleor/new-apps/types";
import React from "react";
import { useIntl } from "react-intl";

import AppListContent from "../AppListContent";

export interface AppListPageProps {
  appList?: SaleorMarketplaceApp[];
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
