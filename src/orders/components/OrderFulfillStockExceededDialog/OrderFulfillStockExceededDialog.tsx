import {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { CardSpacer } from "@saleor/components/CardSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import {
  OrderFulfillLineFragment,
  OrderFulfillStockInput
} from "@saleor/graphql";
import { FormsetData } from "@saleor/hooks/useFormset";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { renderCollection } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import OrderFulfillStockExceededDialogLine from "../OrderFulfillStockExceededDialogLine";
import { stockExceededDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";
import {
  getFulfillmentFormsetQuantity,
  getOrderLineAvailableQuantity
} from "./utils";

export interface OrderFulfillStockExceededDialogProps {
  lines: OrderFulfillLineFragment[];
  open: boolean;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  warehouseId: string;
  confirmButtonState: ConfirmButtonTransitionState;
  onSubmit();
  onClose();
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const {
    lines,
    open,
    formsetData,
    warehouseId,
    confirmButtonState,
    onClose,
    onSubmit
  } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  const exceededLines = lines?.filter(line => {
    const stock = line.variant?.stocks.find(
      stock => stock.warehouse.id === warehouseId
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
              {renderCollection(exceededLines, line => (
                <OrderFulfillStockExceededDialogLine
                  key={line?.id}
                  line={line}
                  formsetData={formsetData}
                  warehouseId={warehouseId}
                />
              ))}
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
