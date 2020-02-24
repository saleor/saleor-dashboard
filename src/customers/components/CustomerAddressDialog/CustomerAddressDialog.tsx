import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import React from "react";
import { FormattedMessage } from "react-intl";

import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { maybe } from "@saleor/misc";
import { UserError } from "@saleor/types";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { AddressTypeInput } from "../../types";
import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressDialogProps {
  address: CustomerAddresses_user_addresses;
  confirmButtonState: ConfirmButtonTransitionState;
  countries: Array<{
    code: string;
    label: string;
  }>;
  errors: UserError[];
  open: boolean;
  variant: "create" | "edit";
  onClose: () => void;
  onConfirm: (data: AddressInput) => void;
}

const styles = createStyles({
  overflow: {
    overflowY: "visible"
  }
});

const CustomerAddressDialog = withStyles(
  styles,
  {}
)(
  ({
    address,
    classes,
    confirmButtonState,
    countries,
    errors,
    open,
    variant,
    onClose,
    onConfirm
  }: CustomerAddressDialogProps & WithStyles<typeof styles>) => {
    const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
      maybe(() => address.country.country, "")
    );
    const {
      errors: validationErrors,
      submit: handleSubmit
    } = useAddressValidation(onConfirm);
    const dialogErrors = useModalDialogErrors(
      [...errors, ...validationErrors],
      open
    );

    const initialForm: AddressTypeInput = {
      city: maybe(() => address.city, ""),
      cityArea: maybe(() => address.cityArea, ""),
      companyName: maybe(() => address.companyName, ""),
      country: maybe(() => address.country.code, ""),
      countryArea: maybe(() => address.countryArea, ""),
      firstName: maybe(() => address.firstName, ""),
      lastName: maybe(() => address.lastName, ""),
      phone: maybe(() => address.phone, ""),
      postalCode: maybe(() => address.postalCode, ""),
      streetAddress1: maybe(() => address.streetAddress1, ""),
      streetAddress2: maybe(() => address.streetAddress2, "")
    };

    const countryChoices = maybe(
      () =>
        countries.map(country => ({
          label: country.label,
          value: country.code
        })),
      []
    );

    return (
      <Dialog
        onClose={onClose}
        open={open}
        classes={{ paper: classes.overflow }}
        fullWidth
        maxWidth="sm"
      >
        <Form initial={initialForm} onSubmit={handleSubmit}>
          {({ change, data }) => {
            const handleCountrySelect = createSingleAutocompleteSelectHandler(
              change,
              setCountryDisplayName,
              countryChoices
            );

            return (
              <>
                <DialogTitle>
                  {variant === "create" ? (
                    <FormattedMessage
                      defaultMessage="Add Address"
                      description="dialog title"
                    />
                  ) : (
                    <FormattedMessage
                      defaultMessage="Edit Address"
                      description="dialog title"
                    />
                  )}
                </DialogTitle>
                <DialogContent className={classes.overflow}>
                  <AddressEdit
                    countries={countryChoices}
                    data={data}
                    countryDisplayValue={countryDisplayName}
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
                    type="submit"
                  >
                    <FormattedMessage {...buttonMessages.save} />
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
CustomerAddressDialog.displayName = "CustomerAddressDialog";
export default CustomerAddressDialog;
