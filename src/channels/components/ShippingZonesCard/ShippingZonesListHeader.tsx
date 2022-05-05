import { AccordionSummary, Typography } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { ChannelShippingZones } from "@saleor/channels/pages/ChannelDetailsPage/types";
import IconChevronDown from "@saleor/icons/ChevronDown";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    // empty expanded needed for mui to use root styles
    expanded: {},
    root: {
      width: "100%",
      border: "none",
      marginRight: theme.spacing(1),
      padding: 0,
      paddingBottom: theme.spacing(2),
      minHeight: 0,

      "&$expanded": {
        minHeight: 0
      }
    },
    content: {
      margin: 0,

      "&$expanded": {
        margin: 0
      }
    }
  }),
  { name: "ShippingZonesListHeader" }
);

const messages = defineMessages({
  title: {
    id: "gtKcPf",
    defaultMessage: "{zonesCount} / {totalCount} shipping zones",
    description: "title"
  }
});

interface ShippingZonesListHeaderProps {
  shippingZones: ChannelShippingZones;
  totalCount: number;
}

const ShippingZonesListHeader: React.FC<ShippingZonesListHeaderProps> = ({
  shippingZones,
  totalCount
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <div className={classes.container}>
      <AccordionSummary expandIcon={<IconChevronDown />} classes={classes}>
        <Typography variant="subtitle2" color="textSecondary">
          {intl.formatMessage(messages.title, {
            zonesCount: shippingZones.length,
            totalCount
          })}
        </Typography>
      </AccordionSummary>
      <HorizontalSpacer spacing={1.5} />
    </div>
  );
};

export default ShippingZonesListHeader;
