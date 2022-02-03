import {
  Accordion,
  Card,
  CardContent,
  Divider,
  makeStyles,
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
      "Select shipping zones that will be supplied via this channel. You can assign shipping zones to multiple channels.",
    description: "card subtitle"
  },
  allSelectedMessage: {
    defaultMessage: "All available shipping zones have been selected",
    description: "all selected zones card message"
  }
});

const useStyles = makeStyles(
  theme => ({
    infoMessage: {
      padding: theme.spacing(3)
    }
  }),
  { name: "ShippingZonesCard" }
);

type ShippingZonesCardProps = ShippingZonesProps;

const ShippingZonesCard: React.FC<ShippingZonesCardProps> = props => {
  const {
    shippingZones,
    removeShippingZone,
    fetchMoreShippingZones: { totalCount }
  } = props;

  const expanderClasses = useExpanderStyles({});
  const classes = useStyles();
  const intl = useIntl();

  const hasMoreZonesToBeSelected = totalCount !== shippingZones.length;

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent>
        <Typography>{intl.formatMessage(messages.subtitle)}</Typography>
      </CardContent>
      <Accordion classes={expanderClasses}>
        <ShippingZonesListHeader
          shippingZones={shippingZones}
          totalCount={totalCount}
        />
        <Divider />
        {shippingZones.map(zone => (
          <ShippingZoneItem zone={zone} onDelete={removeShippingZone} />
        ))}
        {hasMoreZonesToBeSelected ? (
          <ShippingZonesCardListFooter {...props} />
        ) : (
          <Typography
            color="textSecondary"
            variant="subtitle1"
            className={classes.infoMessage}
          >
            {intl.formatMessage(messages.allSelectedMessage)}
          </Typography>
        )}
      </Accordion>
    </Card>
  );
};

export default ShippingZonesCard;
