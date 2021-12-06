import {
  Card,
  CardContent,
  Divider,
  ExpansionPanel,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneItem from "./ShippingZoneItem";
import ShippingZonesCardListFooter from "./ShippingZonesCardListFooter";
import ShippingZonesListHeader from "./ShippingZonesListHeader";
import { useExpanderStyles } from "./styles";
import { ShippingZonesProps } from "./types";

const messages = defineMessages({
  title: {
    defaultMessage: "Shipping Zones",
    description: "card title"
  },
  subtitle: {
    defaultMessage:
      "Select Shipping Zones that will be supplied via this channel. You can assign Shipping Zones to multiple channels.",
    description: "card subtitle"
  }
});

type ShippingZonesCardProps = ShippingZonesProps;

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = props => {
  const {
    shippingZones,
    removeShippingZone,
    fetchMoreShippingZones: { totalCount }
  } = props;

  const expanderClasses = useExpanderStyles({});
  const intl = useIntl();

  const hasMoreZonesToBeSelected = totalCount !== shippingZones.length;

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <ExpansionPanel classes={expanderClasses}>
        <ShippingZonesListHeader shippingZones={shippingZones} />
        <Divider />
        {shippingZones.map(zone => (
          <ShippingZoneItem zone={zone} onDelete={removeShippingZone} />
        ))}
        {hasMoreZonesToBeSelected ? (
          <ShippingZonesCardListFooter {...props} />
        ) : null}
      </ExpansionPanel>
    </Card>
  );
};

export default ShippingZonesCard;
