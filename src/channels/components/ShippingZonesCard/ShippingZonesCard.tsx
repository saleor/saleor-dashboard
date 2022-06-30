import { Card, CardContent, Typography } from "@material-ui/core";
import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import CardTitle from "@saleor/components/CardTitle";
import { SearchShippingZonesQuery } from "@saleor/graphql";
import { FetchMoreProps, RelayToFlat } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import AssignmentList from "../AssignmentList";

const messages = defineMessages({
  title: {
    id: "ANRRpG",
    defaultMessage: "Shipping Zones",
    description: "card title",
  },
  subtitle: {
    id: "Ic7Wln",
    defaultMessage:
      "Select shipping zones that will be supplied via this channel. You can assign shipping zones to multiple channels.",
    description: "card subtitle",
  },
});

interface ShippingZonesCardProps {
  addShippingZone: (id: string) => void;
  removeShippingZone: (id: string) => void;
  searchShippingZones: (searchPhrase: string) => void;
  fetchMoreShippingZones: FetchMoreProps;
  shippingZones: ChannelShippingZones;
  shippingZonesChoices: RelayToFlat<SearchShippingZonesQuery["search"]>;
}

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = props => {
  const {
    addShippingZone,
    removeShippingZone,
    searchShippingZones,
    fetchMoreShippingZones,
    shippingZones,
    shippingZonesChoices,
  } = props;

  const intl = useIntl();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <AssignmentList
        items={shippingZones}
        itemsChoices={shippingZonesChoices}
        addItem={addShippingZone}
        removeItem={removeShippingZone}
        searchItems={searchShippingZones}
        fetchMoreItems={fetchMoreShippingZones}
        dataTestId="shipping-zone"
        inputName="shippingZone"
        itemsName={intl.formatMessage(messages.title)}
      />
    </Card>
  );
};

export default ShippingZonesCard;
