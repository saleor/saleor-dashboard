import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { FormSpacer } from "@saleor/components/FormSpacer";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import TableCellAvatar, {
  AVATAR_MARGIN
} from "@saleor/components/TableCellAvatar";
import { OrderErrorFragment } from "@saleor/fragments/types/OrderErrorFragment";
import { buttonMessages } from "@saleor/intl";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { OrderDetails_order_lines } from "../../types/OrderDetails";

export interface FormData {
  lines: number[];
  trackingNumber: string;
}

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
      width: 100
    },
    remainingQuantity: {
      marginLeft: theme.spacing(),
      paddingTop: 14
    },
    table: {
      tableLayout: "fixed"
    }
  }),
  { name: "OrderFulfillmentDialog" }
);

export interface OrderFulfillmentDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  lines: OrderDetails_order_lines[];
  onClose();
  onSubmit(data: FormData);
}

const OrderFulfillmentDialog: React.FC<OrderFulfillmentDialogProps> = props => {
  const { confirmButtonState, errors, open, lines, onClose, onSubmit } = props;

  const classes = useStyles(props);
  const intl = useIntl();

  const formFields = ["trackingNumber"];
  const formErrors = getFormErrors(formFields, errors);

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
                  defaultMessage="Fulfill Products"
                  description="dialog header"
                />
              </DialogTitle>
              <ResponsiveTable className={classes.table}>
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
                                max: remainingQuantity.toString(),
                                style: { textAlign: "right" }
                              }}
                              className={classes.quantityInput}
                              value={data.lines[productIndex]}
                              onChange={event =>
                                handleQuantityChange(productIndex, event)
                              }
                              error={
                                !!formErrors.trackingNumber ||
                                remainingQuantity < data.lines[productIndex]
                              }
                              helperText={getOrderErrorMessage(
                                formErrors.trackingNumber,
                                intl
                              )}
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
              </ResponsiveTable>
              <DialogContent>
                <FormSpacer />
                <TextField
                  error={!!formErrors.trackingNumber}
                  fullWidth
                  helperText={getOrderErrorMessage(
                    formErrors.trackingNumber,
                    intl
                  )}
                  label={intl.formatMessage({
                    defaultMessage: "Tracking number",
                    description: "fulfillment group"
                  })}
                  name="trackingNumber"
                  value={data.trackingNumber}
                  onChange={change}
                />
                {errors.length > 0 && (
                  <>
                    <FormSpacer />
                    {errors
                      .filter(err => !formFields.includes(err.field))
                      .map((err, index) => (
                        <DialogContentText color="error" key={index}>
                          {getOrderErrorMessage(err, intl)}
                        </DialogContentText>
                      ))}
                  </>
                )}
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
};

OrderFulfillmentDialog.displayName = "OrderFulfillmentDialog";
export default OrderFulfillmentDialog;
