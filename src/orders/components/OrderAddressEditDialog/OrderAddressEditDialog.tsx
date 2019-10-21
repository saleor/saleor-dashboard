import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { AddressTypeInput } from "../../../customers/types";
import { UserError } from "../../../types";

const styles = createStyles({
  overflow: {
    overflowY: "visible"
  }
});

interface OrderAddressEditDialogProps extends WithStyles<typeof styles> {
  confirmButtonState: ConfirmButtonTransitionState;
  address: AddressTypeInput;
  open: boolean;
  errors: UserError[];
  variant: "billing" | "shipping" | string;
  countries?: Array<{
    code: string;
    label: string;
  }>;
  onClose();
  onConfirm(data: AddressTypeInput);
}

const OrderAddressEditDialog = withStyles(styles, {
  name: "OrderAddressEditDialog"
})(
  ({
    address,
    classes,
    confirmButtonState,
    open,
    errors,
    variant,
    countries,
    onClose,
    onConfirm
  }: OrderAddressEditDialogProps) => {
    const intl = useIntl();
    const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
      maybe(
        () => countries.find(country => address.country === country.code).label
      )
    );
    const countryChoices = countries.map(country => ({
      label: country.label,
      value: country.code
    }));

    return (
      <Dialog
        onClose={onClose}
        open={open}
        classes={{ paper: classes.overflow }}
      >
        <Form initial={address} errors={errors} onSubmit={onConfirm}>
          {({ change, data, errors, submit }) => {
            const handleCountrySelect = createSingleAutocompleteSelectHandler(
              change,
              setCountryDisplayName,
              countryChoices
            );

            return (
              <>
                <DialogTitle>
                  {variant === "billing"
                    ? intl.formatMessage({
                        defaultMessage: "Edit Billing Address",
                        description: "dialog header"
                      })
                    : intl.formatMessage({
                        defaultMessage: "Edit Shipping Address",
                        description: "dialog header"
                      })}
                </DialogTitle>
                <DialogContent className={classes.overflow}>
                  <AddressEdit
                    countries={countryChoices}
                    countryDisplayValue={countryDisplayName}
                    data={data}
                    errors={errors}
                    onChange={change}
                    onCountryChange={handleCountrySelect}
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
                    onClick={submit}
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
OrderAddressEditDialog.displayName = "OrderAddressEditDialog";
export default OrderAddressEditDialog;
