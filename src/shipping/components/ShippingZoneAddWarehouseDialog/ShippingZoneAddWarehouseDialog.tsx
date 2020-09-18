import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TextField from "@material-ui/core/TextField";
import CompanyAddressForm from "@saleor/components/CompanyAddressInput/CompanyAddressForm";
import ConfirmButton, {
  ConfirmButtonTransitionState
} from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { AddressTypeInput } from "@saleor/customers/types";
import { WarehouseErrorFragment } from "@saleor/fragments/types/WarehouseErrorFragment";
import useAddressValidation from "@saleor/hooks/useAddressValidation";
import useModalDialogErrors from "@saleor/hooks/useModalDialogErrors";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { buttonMessages } from "@saleor/intl";
import { DialogProps } from "@saleor/types";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZoneAddWarehouseDialogSubmitData
  extends AddressTypeInput {
  name: string;
}
export interface ShippingZoneAddWarehouseDialogProps extends DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: ShopInfo_shop_countries[];
  disabled: boolean;
  errors: WarehouseErrorFragment[];
  onSubmit: (data: ShippingZoneAddWarehouseDialogSubmitData) => void;
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
  streetAddress2: ""
};

const useStyles = makeStyles(
  {
    overflow: {
      overflowY: "visible"
    }
  },
  {
    name: "ShippingZoneAddWarehouseDialog"
  }
);

const ShippingZoneAddWarehouseDialog: React.FC<ShippingZoneAddWarehouseDialogProps> = ({
  confirmButtonState,
  countries,
  disabled,
  errors: apiErrors,
  open,
  onClose,
  onSubmit
}) => {
  const classes = useStyles({});
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps("");
  const {
    errors: validationErrors,
    submit: handleSubmit
  } = useAddressValidation(onSubmit);
  const errors = useModalDialogErrors(
    [...apiErrors, ...validationErrors],
    open
  );
  useModalDialogOpen(open, {});
  const intl = useIntl();

  const countryChoices = countries.map(country => ({
    label: country.country,
    value: country.code
  }));

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
          defaultMessage="Create New Warehouse"
          description="header, dialog"
        />
      </DialogTitle>
      <Form initial={initialForm} onSubmit={handleSubmit}>
        {({ change, data }) => {
          const handleCountrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices
          );

          return (
            <>
              <DialogContent className={classes.overflow}>
                <TextField
                  fullWidth
                  label={intl.formatMessage({
                    defaultMessage: "Warehouse Name"
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
                <Button onClick={onClose}>
                  <FormattedMessage {...buttonMessages.back} />
                </Button>
                <ConfirmButton
                  transitionState={confirmButtonState}
                  color="primary"
                  variant="contained"
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
