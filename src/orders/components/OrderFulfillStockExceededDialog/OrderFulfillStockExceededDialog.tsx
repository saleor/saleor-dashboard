import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { CardSpacer } from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { FulfillmentFragment, OrderFulfillLineFragment } from "@saleor/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import {
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity,
  OrderFulfillStockFormsetData,
} from "@saleor/orders/utils/data";
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
  onSubmit();
  onClose();
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const {
    lines,
    open,
    formsetData,
    confirmButtonState,
    onClose,
    onSubmit,
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const exceededLines = lines?.filter(el => {
    const line = "orderLine" in el ? el.orderLine : el;
    const lineFormWarehouse = formsetData?.find(item => item.id === el.id)
      ?.value?.[0]?.warehouse;
    const stock = line.variant?.stocks.find(
      stock => stock.warehouse.id === lineFormWarehouse?.id,
    );

    return (
      getFulfillmentFormsetQuantity(formsetData, line) >
      getOrderLineAvailableQuantity(line, stock)
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
        maxWidth="sm"
        confirmButtonLabel={intl.formatMessage(messages.fulfillButton)}
      >
        <Typography>{intl.formatMessage(messages.infoLabel)}</Typography>
        <CardSpacer />
        <div className={classes.scrollable}>
          <ResponsiveTable className={classes.table}>
            {!!lines?.length && (
              <TableHead>
                <TableRow>
                  <TableCell className={classes.colName}>
                    {intl.formatMessage(messages.productLabel)}
                  </TableCell>
                  <TableCell className={classes.colQuantity}>
                    {intl.formatMessage(messages.requiredStockLabel)}
                  </TableCell>
                  <TableCell className={classes.colWarehouseStock}>
                    {intl.formatMessage(messages.warehouseStockLabel)}
                  </TableCell>
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              {renderCollection(exceededLines, line => {
                const lineFormWarehouse = formsetData?.find(
                  item => item.id === line.id,
                )?.value?.[0]?.warehouse;

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
