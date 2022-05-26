import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import CompanyAddressForm from "@saleor/components/CompanyAddressInput/CompanyAddressForm";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { AddressTypeInput } from "@saleor/customers/types";
import {
  CountryWithCodeFragment,
  WarehouseErrorFragment,
} from "@saleor/graphql";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import { SubmitPromise } from "@saleor/hooks/useForm";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { ConfirmButtonTransitionState, makeStyles } from "@saleor/macaw-ui";
import { DialogProps } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@saleor/utils/maps";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZoneAddWarehouseDialogSubmitData
  extends AddressTypeInput {
  name: string;
}
export interface ShippingZoneAddWarehouseDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  onSubmit: (data: ShippingZoneAddWarehouseDialogSubmitData) => SubmitPromise;
}

const initialForm: ShippingZoneAddWarehouseDialogSubmitData = {
  city: "",
  cityArea: "",
  companyName: "",
  country: "",
  countryArea: "",
  firstName: "",
  lastName: "",
  name: "",
  phone: "",
  postalCode: "",
  streetAddress1: "",
  streetAddress2: "",
};

const useStyles = makeStyles(
  {
    overflow: {
      overflowY: "visible",
    },
  },
  {
    name: "ShippingZoneAddWarehouseDialog",
  },
);

const ShippingZoneAddWarehouseDialog: React.FC<ShippingZoneAddWarehouseDialogProps> = ({
  confirmButtonState,
  countries,
  disabled,
  errors: apiErrors,
  open,
  onClose,
  onSubmit,
}) => {
  const classes = useStyles({});
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps("");
  const {
    errors: validationErrors,
    submit: handleSubmit,
  } = useAddressValidation(onSubmit);
  const errors = useModalDialogErrors(
    [...apiErrors, ...validationErrors],
    open,
  );
  useModalDialogOpen(open, {});
  const intl = useIntl();

  const countryChoices = mapCountriesToChoices(countries);

  return (
    <Dialog
      classes={{ paper: classes.overflow }}
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <FormattedMessage
          id="yzYXW/"
          defaultMessage="Create New Warehouse"
          description="header, dialog"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={handleSubmit}>
        {({ change, data }) => {
          const handleCountrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices,
          );

          return (
            <>
              <DialogContent className={classes.overflow}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({
                    id: "llBnr+",
                    defaultMessage: "Warehouse Name",
                  })}
                  name="name"
                  value={data.name}
                  onChange={change}
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                <CompanyAddressForm
                  countries={countryChoices}
                  data={data}
                  disabled={disabled}
                  displayCountry={countryDisplayName}
                  errors={errors}
                  onChange={change}
                  onCountryChange={handleCountrySelect}
                />
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  type="submit"
                >
                  <FormattedMessage {...buttonMessages.create} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

ShippingZoneAddWarehouseDialog.displayName = "ShippingZoneAddWarehouseDialog";
export default ShippingZoneAddWarehouseDialog;
