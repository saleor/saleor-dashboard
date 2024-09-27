import BackButton from "@dashboard/components/BackButton";
import CompanyAddressForm from "@dashboard/components/CompanyAddressInput/CompanyAddressForm";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Hr from "@dashboard/components/Hr";
import { DashboardModal } from "@dashboard/components/Modal";
import { AddressTypeInput } from "@dashboard/customers/types";
import { CountryWithCodeFragment, WarehouseErrorFragment } from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import { SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { DialogProps } from "@dashboard/types";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { TextField } from "@material-ui/core";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

export interface ShippingZoneAddWarehouseDialogSubmitData extends AddressTypeInput {
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

const ShippingZoneAddWarehouseDialog: React.FC<ShippingZoneAddWarehouseDialogProps> = ({
  confirmButtonState,
  countries,
  disabled,
  errors: apiErrors,
  open,
  onClose,
  onSubmit,
}) => {
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps("");
  const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onSubmit);
  const errors = useModalDialogErrors([...apiErrors, ...validationErrors], open);

  useModalDialogOpen(open, {});

  const intl = useIntl();
  const countryChoices = mapCountriesToChoices(countries);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form initial={initialForm} onSubmit={handleSubmit}>
        {({ change, data, submit }) => {
          const handleCountrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices,
          );

          return (
            <DashboardModal.Content size="sm">
              <DashboardModal.Header onClose={onClose}>
                <FormattedMessage
                  id="yzYXW/"
                  defaultMessage="Create New Warehouse"
                  description="header, dialog"
                />
              </DashboardModal.Header>

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

              <Hr />

              <CompanyAddressForm
                countries={countryChoices}
                data={data}
                disabled={disabled}
                displayCountry={countryDisplayName}
                errors={errors}
                onChange={change}
                onCountryChange={handleCountrySelect}
              />

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton transitionState={confirmButtonState} onClick={submit}>
                  <FormattedMessage {...buttonMessages.create} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          );
        }}
      </Form>
    </DashboardModal>
  );
};

ShippingZoneAddWarehouseDialog.displayName = "ShippingZoneAddWarehouseDialog";
export default ShippingZoneAddWarehouseDialog;
