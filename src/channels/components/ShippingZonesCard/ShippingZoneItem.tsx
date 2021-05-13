import { Divider, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ChannelShippingZone } from "@saleor/channels/pages/ChannelDetailsPage/types";
import DeletableItem from "@saleor/components/DeletableItem";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    container: {
      paddingLeft: theme.spacing(3),
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }),
  { name: "ShippingZoneItem" }
);

interface ShippingZoneItemProps {
  zone: ChannelShippingZone;
  onDelete: (id: string) => void;
}

const ShippingZoneItem: React.FC<ShippingZoneItemProps> = ({
  zone,
  onDelete
}) => {
  const { id, name } = zone;
  const classes = useStyles({});

  return (
    <>
      <div className={classes.container}>
        <Typography>{name}</Typography>
        <DeletableItem id={id} onDelete={onDelete} />
      </div>
      <Divider />
    </>
  );
};

export default ShippingZoneItem;
