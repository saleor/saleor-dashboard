import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Money from "@saleor/components/Money";
import { SingleSelectField } from "@saleor/components/SingleSelectField";
import { OrderDetailsFragment, OrderErrorFragment } from "@saleor/graphql";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { getFormErrors } from "@saleor/utils/errors";
import getOrderErrorMessage from "@saleor/utils/errors/order";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface FormData {
  shippingMethod: string;
}

const useStyles = makeStyles(
  theme => ({
    dialog: {
      overflowY: "visible",
    },
    menuItem: {
      display: "flex",
      width: "100%",
      flexWrap: "wrap",
    },
    price: {
      marginRight: theme.spacing(3),
    },
    root: {
      overflowY: "visible",
      width: theme.breakpoints.values.sm,
      margin: 0,
      padding: theme.spacing(3),
    },
    shippingMethodName: {
      flex: 1,
      overflowX: "hidden",
      textOverflow: "ellipsis",
    },
    message: {
      width: "100%",
    },
  }),
  { name: "OrderShippingMethodEditDialog" },
);

export interface OrderShippingMethodEditDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  errors: OrderErrorFragment[];
  open: boolean;
  shippingMethod: string;
  shippingMethods?: OrderDetailsFragment["shippingMethods"];
  onClose();
  onSubmit?(data: FormData);
}

const OrderShippingMethodEditDialog: React.FC<OrderShippingMethodEditDialogProps> = props => {
  const {
    confirmButtonState,
    errors: apiErrors,
    open,
    shippingMethod,
    shippingMethods,
    onClose,
    onSubmit,
  } = props;
  const classes = useStyles(props);
  const errors = useModalDialogErrors(apiErrors, open);
  const intl = useIntl();

  const formFields = ["shippingMethod"];
  const formErrors = getFormErrors(formFields, errors);
  const nonFieldErrors = errors.filter(err => !formFields.includes(err.field));

  const choices = shippingMethods
    ? shippingMethods
        .map(s => ({
          label: (
            <div className={classes.menuItem}>
              <span className={classes.shippingMethodName}>{s.name}</span>
              &nbsp;
              <span className={classes.price}>
                <Money money={s.price} />
              </span>
              {!s.active && (
                <Typography className={classes.message} variant="caption">
                  {s.message}
                </Typography>
              )}
            </div>
          ),
          disabled: !s.active,
          value: s.id,
        }))
        .sort((x, y) => (x.disabled === y.disabled ? 0 : x.disabled ? 1 : -1))
    : [];
  const initialForm: FormData = {
    shippingMethod,
  };

  return (
    <Dialog onClose={onClose} open={open} classes={{ paper: classes.dialog }}>
      <DialogTitle>
        <FormattedMessage
          id="V/YxJa"
          defaultMessage="Edit Shipping Method"
          description="dialog header"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={onSubmit}>
        {({ change, data }) => (
          <>
            <DialogContent className={classes.root}>
              <SingleSelectField
                choices={choices}
                error={!!formErrors.shippingMethod}
                hint={getOrderErrorMessage(formErrors.shippingMethod, intl)}
                name="shippingMethod"
                value={data.shippingMethod}
                onChange={change}
              />
              {nonFieldErrors.length > 0 && (
                <>
                  <FormSpacer />
                  {nonFieldErrors.map((err, index) => (
                    <DialogContentText color="error" key={index}>
                      {getOrderErrorMessage(err, intl)}
                    </DialogContentText>
                  ))}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <BackButton onClick={onClose} />
              <ConfirmButton
                transitionState={confirmButtonState}
                type="submit"
                disabled={!data.shippingMethod}
              >
                <FormattedMessage {...buttonMessages.confirm} />
              </ConfirmButton>
            </DialogActions>
          </>
        )}
      </Form>
    </Dialog>
  );
};
OrderShippingMethodEditDialog.displayName = "OrderShippingMethodEditDialog";
export default OrderShippingMethodEditDialog;
