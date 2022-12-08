import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

export const AppListPage: React.FC = () => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
    </Container>
  );
};
AppListPage.displayName = "AppListPage";
export default AppListPage;
