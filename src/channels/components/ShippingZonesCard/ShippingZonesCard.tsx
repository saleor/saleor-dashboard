import {
  Accordion,
  Card,
  CardContent,
  Divider,
  Typography
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ShippingZoneItem from "./ShippingZoneItem";
import ShippingZonesCardListFooter from "./ShippingZonesCardListFooter";
import ShippingZonesListHeader from "./ShippingZonesListHeader";
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

const useExpanderStyles = makeStyles(
  () => ({
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      boxShadow: "none",

      "&:before": {
        content: "none"
      },

      "&$expanded": {
        margin: 0,
        border: "none"
      }
    }
  }),
  { name: "ShippingZonesCardExpander" }
);

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
      <Accordion classes={expanderClasses}>
        <ShippingZonesListHeader shippingZones={shippingZones} />
        <Divider />
        {shippingZones.map(zone => (
          <ShippingZoneItem zone={zone} onDelete={removeShippingZone} />
        ))}
        {hasMoreZonesToBeSelected ? (
          <ShippingZonesCardListFooter {...props} />
        ) : null}
      </Accordion>
    </Card>
  );
};

export default ShippingZonesCard;
