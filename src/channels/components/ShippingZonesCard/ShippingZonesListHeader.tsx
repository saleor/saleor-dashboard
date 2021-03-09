import { Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import IconChevronDown from "@saleor/icons/ChevronDown";
import IconChevronUp from "@saleor/icons/ChevronUp";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

const useStyles = makeStyles(
  theme => ({
    container: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(0, 3)
    },
    iconContainer: {
      padding: theme.spacing(1, 0),
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }
  }),
  { name: "ShippingZonesListHeader" }
);

const messages = defineMessages({
  title: {
    defaultMessage: "{zonesCount} Shipping Zones",
    description: "title"
  }
});

interface ShippingZonesListHeaderProps {
  isListOpen: boolean;
  zonesCount?: number;
  onOpenChange: () => void;
}

const ShippingZonesListHeader: React.FC<ShippingZonesListHeaderProps> = ({
  isListOpen,
  zonesCount = 0,
  onOpenChange
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <>
      <div className={classes.container}>
        <Typography variant="subtitle2" color="textSecondary">
          {intl.formatMessage(messages.title, { zonesCount })}
        </Typography>
        {!!zonesCount && (
          <div className={classes.iconContainer} onClick={onOpenChange}>
            {isListOpen ? <IconChevronUp /> : <IconChevronDown />}
          </div>
        )}
      </div>
      <Divider />
    </>
  );
};

export default ShippingZonesListHeader;
