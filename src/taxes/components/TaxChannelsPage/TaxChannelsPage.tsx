import { Card } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import {
  Backlink,
  Button,
  List,
  ListHeader,
  ListItem,
  ListItemCell,
  PageTab,
  PageTabs
} from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import TaxChannelsMenu from "../TaxChannelsMenu";
import TaxCountryExceptionListItem from "../TaxCountryExceptionListItem";
import TaxSettingsCard from "../TaxSettingsCard";

interface TaxChannelsPageProps {
  data: any;
  channels: any;
  selectedChannelId: string;
  handleTabChange: (tab: string) => void;
  onBack: () => void;
}

export const TaxChannelsPage: React.FC<TaxChannelsPageProps> = props => {
  const { data, channels, selectedChannelId, handleTabChange, onBack } = props;

  const intl = useIntl();

  return (
    <Container>
      <Backlink onClick={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </Backlink>
      <PageHeader title={intl.formatMessage(sectionNames.taxes)} />
      <PageTabs value="channels" onChange={handleTabChange}>
        <PageTab label={"Channels"} value="channels" />
        <PageTab label={"Countries"} value="countries" />
        <PageTab label={"Tax classes"} value="classes" />
      </PageTabs>
      <VerticalSpacer spacing={2} />
      <Grid variant="inverted">
        <TaxChannelsMenu
          channels={channels}
          selectedChannelId={selectedChannelId}
        />
        <div>
          <TaxSettingsCard />
          <VerticalSpacer spacing={3} />
          <Card>
            <CardTitle
              title={intl.formatMessage(taxesMessages.countryExceptions)}
              toolbar={
                <Button variant="secondary">
                  <FormattedMessage {...taxesMessages.addCountryLabel} />
                </Button>
              }
            />
            <List gridTemplate={["4fr 3fr 3fr 1fr"]}>
              <ListHeader>
                <ListItem>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.countryNameHeader} />
                  </ListItemCell>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.chargeTaxesHeader} />
                  </ListItemCell>
                  <ListItemCell>
                    <FormattedMessage {...taxesMessages.showGrossHeader} />
                  </ListItemCell>
                </ListItem>
              </ListHeader>
              {data.map(country => (
                <TaxCountryExceptionListItem
                  country={country}
                  key={country.id}
                />
              ))}
            </List>
          </Card>
        </div>
      </Grid>
    </Container>
  );
};
export default TaxChannelsPage;
