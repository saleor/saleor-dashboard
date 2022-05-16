import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PageTab, PageTabs } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import TaxCountriesMenu from "../TaxCountryMenu";

interface TaxCountriesPageProps {
  data: any;
  selectedCountryId: string;
  handleTabChange: (tab: string) => void;
}

export const TaxCountriesPage: React.FC<TaxCountriesPageProps> = props => {
  const { data, selectedCountryId, handleTabChange } = props;

  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
      <PageTabs value="countries" onChange={handleTabChange}>
        <PageTab label={"Channels"} value="channels" />
        <PageTab label={"Countries"} value="countries" />
        <PageTab label={"Tax classes"} value="classes" />
      </PageTabs>
      <VerticalSpacer spacing={2} />
      <Grid variant="inverted">
        <TaxCountriesMenu
          countries={data}
          selectedCountryId={selectedCountryId}
          onCountryDelete={() => null}
        />
        <div></div>
      </Grid>
    </Container>
  );
};
export default TaxCountriesPage;
