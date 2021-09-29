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
import { FormsetData } from "@saleor/hooks/useFormset";
import { makeStyles } from "@saleor/macaw-ui";
import { maybe, renderCollection } from "@saleor/misc";
import { OrderFulfillData_order_lines } from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import { stockExceededDialogMessages as messages } from "./messages";

const useStyles = makeStyles(
  theme => ({
    colName: {
      width: "auto",
      margin: "0px"
    },
    colQuantity: {
      textAlign: "right",
      width: "20%"
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderFulfillStockExceededDialog" }
);

export interface OrderFulfillStockExceededDialogProps {
  lines: OrderFulfillData_order_lines[];
  open: boolean;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  onClose();
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const { lines, open, formsetData, onClose } = props;

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
                  {intl.formatMessage(messages.productLabel)}
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
              lines?.filter((line, lineIndex) =>
                line.variant.stocks.some(
                  stock =>
                    stock.quantity <
                    formsetData[lineIndex].value.find(
                      val => val.warehouse === stock.warehouse.id
                    ).quantity
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

                return renderCollection(
                  line.variant.stocks.filter(stock => {
                    const warehouseAllocation = line.allocations.find(
                      allocation =>
                        allocation.warehouse.id === stock.warehouse.id
                    );
                    const allocatedQuantityForLine =
                      warehouseAllocation?.quantity || 0;

                    const availableQuantity =
                      stock.quantity -
                      stock.quantityAllocated +
                      allocatedQuantityForLine;

                    const qA = availableQuantity;
                    const qB = formsetData
                      .find(data => data.id === line.id)
                      .value.find(val => val.warehouse === stock.warehouse.id)
                      .quantity;
                    return qA < qB;
                  }),
                  stock => (
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
                      <TableCell className={classes.colQuantity}>
                        {"0"}
                      </TableCell>
                      <TableCell className={classes.colQuantity}>
                        {stock.warehouse.id}
                      </TableCell>
                    </TableRow>
                  )
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
