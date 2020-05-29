import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import React from "react";
import { useIntl } from "react-intl";

import { AppListUrlQueryParams } from "../../urls";

interface AppDetailsProps {
  id: string;
  params: AppListUrlQueryParams;
}

export const AppDetails: React.FC<AppDetailsProps> = () => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.apps)} />
    </Container>
  );
};

export default AppDetails;
