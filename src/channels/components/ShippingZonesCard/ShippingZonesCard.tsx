import {
  Card,
  CardContent,
  Divider,
  makeStyles,
  Typography
} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import CardTitle from "@saleor/components/CardTitle";
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
  const { shippingZones, removeShippingZone } = props;

  const expanderClasses = useExpanderStyles({});
  const intl = useIntl();

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
        <ShippingZonesCardListFooter {...props} />
      </ExpansionPanel>
    </Card>
  );
};

export default ShippingZonesCard;
