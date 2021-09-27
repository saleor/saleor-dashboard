import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { AVATAR_MARGIN } from "@saleor/components/TableCellAvatar/Avatar";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import {
  FulfillOrder_orderFulfill,
  FulfillOrder_orderFulfill_errors
} from "@saleor/orders/types/FulfillOrder";
import { OrderFulfillData_order_lines } from "@saleor/orders/types/OrderFulfillData";
import React from "react";
import { useIntl } from "react-intl";

import { stockExceededDialogMessages as messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    colName: {
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colQuantity: {
      textAlign: "right",
      width: 120
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderFulfillStockExceededDialog" }
);

export interface OrderFulfillStockExceededDialogProps {
  lines: OrderFulfillData_order_lines[];
  errors: FulfillOrder_orderFulfill_errors[];
  open: boolean;
  onClose();
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const { lines, errors, open, onClose } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <>
      <ActionDialog
        open={open}
        title={intl.formatMessage(messages.title)}
        onConfirm={() => null}
        onClose={onClose}
        confirmButtonState={"default"}
        maxWidth={"sm"}
        confirmButtonLabel={intl.formatMessage(messages.fulfillButton)}
      >
        {intl.formatMessage(messages.infoLabel)}
        <ResponsiveTable className={classes.table}>
          {maybe(() => !!lines.length) && (
            <TableHead>
              <TableRow>
                <TableCell className={classes.colName}>
                  <span className={classes.colNameLabel}>
                    {intl.formatMessage(messages.productLabel)}
                  </span>
                </TableCell>
                <TableCell className={classes.colQuantity}>
                  {intl.formatMessage(messages.requiredStockLabel)}
                </TableCell>
                <TableCell className={classes.colQuantity}>
                  {intl.formatMessage(messages.availableStockLabel)}
                </TableCell>
              </TableRow>
            </TableHead>
          )}

          <TableBody>
            {renderCollection(
              lines?.filter(line =>
                // line.id needs to match any of the orderLines
                errors?.some(err =>
                  err.orderLines.some(orderLine => orderLine === line.id)
                )
              ),
              (line, lineIndex) => {
                if (!line) {
                  return (
                    <TableRow key={lineIndex}>
                      <TableCellAvatar className={classes.colName}>
                        <Skeleton />
                      </TableCellAvatar>
                      <TableCell className={classes.colQuantity}>
                        <Skeleton />
                      </TableCell>
                      <TableCell className={classes.colQuantity}>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  );
                }
                return (
                  <TableRow key={line?.id}>
                    <TableCellAvatar
                      className={classes.colName}
                      thumbnail={maybe(() => line.thumbnail.url)}
                    >
                      {line?.productName}
                      <Typography color="textSecondary" variant="caption">
                        {line.variant.attributes
                          .map(attribute =>
                            attribute.values
                              .map(attributeValue => attributeValue.name)
                              .join(", ")
                          )
                          .join(" / ")}
                      </Typography>
                    </TableCellAvatar>
                    <TableCell className={classes.colQuantity}>{"0"}</TableCell>
                    <TableCell className={classes.colQuantity}>{"0"}</TableCell>
                  </TableRow>
                );
              },
              () => null
            )}
          </TableBody>
        </ResponsiveTable>
        {intl.formatMessage(messages.questionLabel)}
      </ActionDialog>
    </>
  );
};

OrderFulfillStockExceededDialog.displayName = "OrderFulfillStockExceededDialog";
export default OrderFulfillStockExceededDialog;
