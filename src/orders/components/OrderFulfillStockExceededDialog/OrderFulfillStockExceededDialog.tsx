// @ts-strict-ignore
import ActionDialog from "@dashboard/components/ActionDialog";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { FulfillmentFragment, OrderFulfillLineFragment } from "@dashboard/graphql";
import { renderCollection } from "@dashboard/misc";
import {
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity,
  OrderFulfillStockFormsetData,
} from "@dashboard/orders/utils/data";
import { TableBody, TableCell, TableHead, Typography } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import OrderFulfillStockExceededDialogLine from "../OrderFulfillStockExceededDialogLine";
import { stockExceededDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";

export interface OrderFulfillStockExceededDialogProps {
  lines: Array<FulfillmentFragment["lines"][0] | OrderFulfillLineFragment>;
  open: boolean;
  formsetData: OrderFulfillStockFormsetData;
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit: () => any;
  onClose: () => any;
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const { lines, open, formsetData, confirmButtonState, onClose, onSubmit } = props;
  const intl = useIntl();
  const classes = useStyles(props);
  const exceededLines = lines?.filter(el => {
    const line = "orderLine" in el ? el.orderLine : el;
    const lineFormWarehouse = formsetData?.find(item => item.id === el.id)?.value?.[0]?.warehouse;
    const stock = line.variant?.stocks.find(stock => stock.warehouse.id === lineFormWarehouse?.id);

    return (
      getFulfillmentFormsetQuantity(formsetData, line) > getOrderLineAvailableQuantity(line, stock)
    );
  });

  return (
    <>
      <ActionDialog
        open={open}
        title={intl.formatMessage(messages.title)}
        onConfirm={onSubmit}
        onClose={onClose}
        confirmButtonState={confirmButtonState}
        confirmButtonLabel={intl.formatMessage(messages.fulfillButton)}
      >
        <Typography>{intl.formatMessage(messages.infoLabel)}</Typography>
        <CardSpacer />
        <div className={classes.scrollable}>
          <ResponsiveTable className={classes.table}>
            {!!lines?.length && (
              <TableHead>
                <TableRowLink>
                  <TableCell className={classes.colName}>
                    {intl.formatMessage(messages.productLabel)}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {intl.formatMessage(messages.requiredStockLabel)}
                  </TableCell>
                  <TableCell className={classes.colWarehouseStock}>
                    {intl.formatMessage(messages.warehouseStockLabel)}
                  </TableCell>
                </TableRowLink>
              </TableHead>
            )}

            <TableBody>
              {renderCollection(exceededLines, line => {
                const lineFormWarehouse = formsetData?.find(item => item.id === line.id)?.value?.[0]
                  ?.warehouse;

                return (
                  <OrderFulfillStockExceededDialogLine
                    key={line?.id}
                    line={line}
                    formsetData={formsetData}
                    warehouseId={lineFormWarehouse?.id}
                  />
                );
              })}
            </TableBody>
          </ResponsiveTable>
        </div>
        <CardSpacer />
        <Typography>{intl.formatMessage(messages.questionLabel)}</Typography>
      </ActionDialog>
    </>
  );
};

OrderFulfillStockExceededDialog.displayName = "OrderFulfillStockExceededDialog";
export default OrderFulfillStockExceededDialog;
