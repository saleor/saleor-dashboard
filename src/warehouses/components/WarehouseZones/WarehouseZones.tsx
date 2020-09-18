import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import CardTitle from "@saleor/components/CardTitle";
import Link from "@saleor/components/Link";
import Skeleton from "@saleor/components/Skeleton";
import { maybe, renderCollection } from "@saleor/misc";
import { WarehouseDetails_warehouse_shippingZones_edges_node } from "@saleor/warehouses/types/WarehouseDetails";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface WarehouseInfoProps {
  zones: WarehouseDetails_warehouse_shippingZones_edges_node[];
  onShippingZoneClick: (id: string) => void;
}

const useStyles = makeStyles(
  theme => ({
    link: {
      "&:not(:last-of-type)": {
        marginBottom: theme.spacing()
      }
    }
  }),
  {
    name: "WarehouseInfoProps"
  }
);

const WarehouseInfo: React.FC<WarehouseInfoProps> = ({
  zones,
  onShippingZoneClick
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage({
          defaultMessage: "Shipping Zones",
          description: "zones that warehouse sends to"
        })}
      />
      <CardContent>
        {renderCollection(
          zones,
          zone =>
            maybe(
              () => (
                <div className={classes.link} key={zone.id}>
                  <Link underline onClick={() => onShippingZoneClick(zone.id)}>
                    {zone.name}
                  </Link>
                </div>
              ),
              <Skeleton />
            ),
          () => (
            <Typography color="textSecondary">
              <FormattedMessage defaultMessage="This warehouse has no shipping zones assigned." />
            </Typography>
          )
        )}
      </CardContent>
    </Card>
  );
};

WarehouseInfo.displayName = "WarehouseInfo";
export default WarehouseInfo;
