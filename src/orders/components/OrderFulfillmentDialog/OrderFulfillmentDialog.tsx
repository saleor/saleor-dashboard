import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";

export interface FormData {
  lines: number[];
  trackingNumber: string;
}

const styles = (theme: Theme) =>
  createStyles({
    colName: {
      width: "auto"
    },
    colNameLabel: {
      marginLeft: AVATAR_MARGIN
    },
    colQuantity: {
      textAlign: "right",
      width: 150
    },
    colQuantityContent: {
      alignItems: "center",
      display: "inline-flex"
    },
    colSku: {
      width: 120
    },
    quantityInput: {
      width: "4rem"
    },
    remainingQuantity: {
      marginLeft: theme.spacing.unit,
      paddingTop: 14
    },
    table: {
      tableLayout: "fixed"
    }
  });

export interface OrderFulfillmentDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  lines: OrderDetails_order_lines[];
  onClose();
  onSubmit(data: FormData);
}

const OrderFulfillmentDialog = withStyles(styles, {
  name: "OrderFulfillmentDialog"
})(
  ({
    classes,
    confirmButtonState,
    open,
    lines,
    onClose,
    onSubmit
  }: OrderFulfillmentDialogProps) => {
    const intl = useIntl();

    return (
      <Dialog onClose={onClose} open={open}>
        <Form
          initial={{
            lines: maybe(
              () =>
                lines.map(
                  product => product.quantity - product.quantityFulfilled
                ),
              []
            ),
            trackingNumber: ""
          }}
          onSubmit={onSubmit}
        >
          {({ data, change }) => {
            const handleQuantityChange = (
              productIndex: number,
              event: React.ChangeEvent<any>
            ) => {
              const newData = data.lines;
              newData[productIndex] = event.target.value;
              change({
                target: {
                  name: "lines",
                  value: newData
                }
              } as any);
            };
            return (
              <>
                <DialogTitle>
                  <FormattedMessage
                    defaultMessage="Fulfill Oroducts"
                    description="dialog header"
                  />
                </DialogTitle>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.colName}>
                        <span className={classes.colNameLabel}>
                          <FormattedMessage defaultMessage="Product name" />
                        </span>
                      </TableCell>
                      <TableCell className={classes.colSku}>
                        <FormattedMessage
                          defaultMessage="SKU"
                          description="product's sku"
                        />
                      </TableCell>
                      <TableCell className={classes.colQuantity}>
                        <FormattedMessage
                          defaultMessage="Quantity"
                          description="quantity of fulfilled products"
                        />
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lines.map((product, productIndex) => {
                      const remainingQuantity =
                        product.quantity - product.quantityFulfilled;
                      return (
                        <TableRow key={product.id}>
                          <TableCellAvatar
                            className={classes.colName}
                            thumbnail={maybe(() => product.thumbnail.url)}
                          >
                            {product.productName}
                          </TableCellAvatar>
                          <TableCell className={classes.colSku}>
                            {product.productSku}
                          </TableCell>
                          <TableCell className={classes.colQuantity}>
                            <div className={classes.colQuantityContent}>
                              <TextField
                                type="number"
                                inputProps={{
                                  max: remainingQuantity,
                                  style: { textAlign: "right" }
                                }}
                                className={classes.quantityInput}
                                value={data.lines[productIndex]}
                                onChange={event =>
                                  handleQuantityChange(productIndex, event)
                                }
                                error={
                                  remainingQuantity < data.lines[productIndex]
                                }
                              />
                              <div className={classes.remainingQuantity}>
                                / {remainingQuantity}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <DialogContent>
                  <FormSpacer />
                  <TextField
                    fullWidth
                    label={intl.formatMessage({
                      defaultMessage: "Tracking number",
                      description: "fulfillment group"
                    })}
                    name="trackingNumber"
                    value={data.trackingNumber}
                    onChange={change}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose}>
                    <FormattedMessage {...buttonMessages.back} />
                  </Button>
                  <ConfirmButton
                    transitionState={confirmButtonState}
                    color="primary"
                    variant="contained"
                    type="submit"
                  >
                    <FormattedMessage {...buttonMessages.confirm} />
                  </ConfirmButton>
                </DialogActions>
              </>
            );
          }}
        </Form>
      </Dialog>
    );
  }
);
OrderFulfillmentDialog.displayName = "OrderFulfillmentDialog";
export default OrderFulfillmentDialog;
