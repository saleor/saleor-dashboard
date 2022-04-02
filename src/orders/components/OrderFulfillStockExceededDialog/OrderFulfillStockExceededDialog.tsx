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
import Skeleton from "@saleor/components/Skeleton";
import TableCellAvatar from "@saleor/components/TableCellAvatar";
import { FormsetData } from "@saleor/hooks/useFormset";
import { renderCollection } from "@saleor/misc";
import { OrderFulfillData_order_lines } from "@saleor/orders/types/OrderFulfillData";
import { OrderFulfillStockInput } from "@saleor/types/globalTypes";
import React from "react";
import { useIntl } from "react-intl";

import OrderFulfillStockExceededDialogLines from "../OrderFulfillStockExceededDialogLine";
import { stockExceededDialogMessages as messages } from "./messages";
import { useStyles } from "./styles";

export interface OrderFulfillStockExceededDialogProps {
  lines: OrderFulfillData_order_lines[];
  open: boolean;
  formsetData: FormsetData<null, OrderFulfillStockInput[]>;
  onSubmit();
  onClose();
}

const OrderFulfillStockExceededDialog: React.FC<OrderFulfillStockExceededDialogProps> = props => {
  const { lines, open, formsetData, onClose, onSubmit } = props;

  const intl = useIntl();
  const classes = useStyles(props);

  return (
    <>
      <ActionDialog
        open={open}
        title={intl.formatMessage(messages.title)}
        onConfirm={onSubmit}
        onClose={onClose}
        confirmButtonState="default"
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
                  <TableCell className={classes.colQuantity}>
                    {intl.formatMessage(messages.availableStockLabel)}
                  </TableCell>
                  <TableCell className={classes.colWarehouseStock}>
                    {intl.formatMessage(messages.warehouseStockLabel)}
                  </TableCell>
                </TableRow>
              </TableHead>
            )}

            <TableBody>
              {renderCollection(
                lines,
                line => (
                  <OrderFulfillStockExceededDialogLines
                    key={line?.id}
                    line={line}
                    formsetData={formsetData}
                    classes={classes}
                  />
                ),
                () => (
                  <TableRow>
                    <TableCellAvatar className={classes.colName}>
                      <Skeleton />
                    </TableCellAvatar>
                    <TableCell className={classes.colQuantity}>
                      <Skeleton />
                    </TableCell>
                    <TableCell className={classes.colQuantity}>
                      <Skeleton />
                    </TableCell>
                    <TableCell className={classes.colWarehouseStock}>
                      <Skeleton />
                    </TableCell>
                  </TableRow>
                )
              )}
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
