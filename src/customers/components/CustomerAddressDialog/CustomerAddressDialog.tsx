import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
import AddressEdit from "@saleor/components/AddressEdit";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AccountErrorFragment } from "@saleor/fragments/types/AccountErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { createStyles, WithStyles, withStyles } from "@saleor/theme";
import { AddressInput } from "@saleor/types/globalTypes";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AddressTypeInput } from "../../types";
import { CustomerAddresses_user_addresses } from "../../types/CustomerAddresses";

export interface CustomerAddressDialogProps {
  address: CustomerAddresses_user_addresses;
  confirmButtonState: ConfirmButtonTransitionState;
  countries: ShopInfo_shop_countries[];
  errors: AccountErrorFragment[];
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
      address?.country.country || ""
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
      city: address?.city || "",
      cityArea: address?.cityArea || "",
      companyName: address?.companyName || "",
      country: address?.country.code || "",
      countryArea: address?.countryArea || "",
      firstName: address?.firstName || "",
      lastName: address?.lastName || "",
      phone: address?.phone || "",
      postalCode: address?.postalCode || "",
      streetAddress1: address?.streetAddress1 || "",
      streetAddress2: address?.streetAddress2 || ""
    };

    const countryChoices = mapCountriesToChoices(countries || []);

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
