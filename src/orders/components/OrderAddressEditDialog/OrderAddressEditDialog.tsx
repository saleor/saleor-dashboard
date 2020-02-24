import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { AddressTypeInput } from "@saleor/customers/types";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";

const useStyles = makeStyles(
  {
    overflow: {
      overflowY: "visible"
    }
  },
  { name: "OrderAddressEditDialog" }
);

interface OrderAddressEditDialogProps {
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
  onConfirm(data: AddressInput);
}

const OrderAddressEditDialog: React.FC<OrderAddressEditDialogProps> = props => {
  const {
    address,
    confirmButtonState,
    open,
    errors,
    variant,
    countries,
    onClose,
    onConfirm
  } = props;

  const classes = useStyles(props);
  const intl = useIntl();
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
    maybe(
      () => countries.find(country => address.country === country.code).label
    )
  );
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors(
    [...errors, ...validationErrors],
    open
  );

  const countryChoices = countries.map(country => ({
    label: country.label,
    value: country.code
  }));

  return (
    <Dialog onClose={onClose} open={open} classes={{ paper: classes.overflow }}>
      <Form initial={address} onSubmit={handleSubmit}>
        {({ change, data, submit }) => {
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
                  errors={dialogErrors}
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
};

OrderAddressEditDialog.displayName = "OrderAddressEditDialog";
export default OrderAddressEditDialog;
