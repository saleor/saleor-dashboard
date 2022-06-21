import { Card, CardActions, TableBody, Typography } from "@material-ui/core";
import { Button } from "@saleor/components/Button";
import CardSpacer from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import { OrderLineFragment, WarehouseFragment } from "@saleor/graphql";
import { commonMessages } from "@saleor/intl";
import { ChevronIcon, makeStyles } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { FormattedMessage } from "react-intl";

import OrderCardTitle from "../OrderCardTitle";
import TableHeader from "../OrderProductsCardElements/OrderProductsCardHeader";
import TableLine from "../OrderProductsCardElements/OrderProductsTableRow";

const useStyles = makeStyles(
  theme => ({
    actions: {
      flexDirection: "row-reverse",
      padding: theme.spacing(2, 3),
    },
    table: {
      "& td, & th": {
        "&:not(:first-child):not(:last-child)": {
          paddingLeft: theme.spacing(1),
          paddingRight: theme.spacing(1),
        },
      },
      tableLayout: "fixed",
    },
    toolbar: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      borderRadius: "4px",
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingRight: theme.spacing(0.5),
      paddingLeft: theme.spacing(1.5),
      "&:hover": {
        backgroundColor: theme.palette.saleor.active[5],
        color: theme.palette.saleor.active[1],
      },
      "& > div": {
        minWidth: 0,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    cardTitle: {
      justifyContent: "space-between",
      "& > div": {
        "&:first-child": {
          flex: 0,
          whiteSpace: "nowrap",
        },
        "&:last-child": {
          flex: "0 1 auto",
          minWidth: 0,
          marginLeft: theme.spacing(1),
        },
      },
    },
  }),
  { name: "OrderUnfulfilledItems" },
);

interface OrderUnfulfilledProductsCardProps {
  showFulfillmentAction: boolean;
  notAllowedToFulfillUnpaid: boolean;
  lines: OrderLineFragment[];
  onFulfill: () => void;
  selectedWarehouse: WarehouseFragment;
  onWarehouseChange: () => null;
}

const OrderUnfulfilledProductsCard: React.FC<OrderUnfulfilledProductsCardProps> = props => {
  const {
    showFulfillmentAction,
    notAllowedToFulfillUnpaid,
    lines,
    onFulfill,
    selectedWarehouse,
    onWarehouseChange,
  } = props;
  const classes = useStyles({});

  if (!lines.length) {
    return null;
  }

  return (
    <>
      <Card>
        <OrderCardTitle
          lines={lines}
          withStatus
          status="unfulfilled"
          className={classes.cardTitle}
          toolbar={
            <div className={classes.toolbar} onClick={onWarehouseChange}>
              <div>{selectedWarehouse?.name ?? <Skeleton />}</div>
              <ChevronIcon />
            </div>
          }
        />
        <ResponsiveTable className={classes.table}>
          <TableHeader />
          <TableBody>
            {renderCollection(lines, line => (
              <TableLine key={line.id} isOrderLine line={line} />
            ))}
          </TableBody>
        </ResponsiveTable>
        {showFulfillmentAction && (
          <CardActions className={classes.actions}>
            <Button
              variant="primary"
              onClick={onFulfill}
              disabled={notAllowedToFulfillUnpaid}
            >
              <FormattedMessage
                id="/Xwjww"
                defaultMessage="Fulfill"
                description="button"
              />
            </Button>
            {notAllowedToFulfillUnpaid && (
              <Typography color="error" variant="caption">
                <FormattedMessage
                  {...commonMessages.cannotFullfillUnpaidOrder}
                />
              </Typography>
            )}
          </CardActions>
        )}
      </Card>
      <CardSpacer />
    </>
  );
};

export default OrderUnfulfilledProductsCard;
