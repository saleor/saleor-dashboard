import AddressEdit from "@dashboard/components/AddressEdit";
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import {
  AccountErrorFragment,
  AddressFragment,
  AddressInput,
  CountryWithCodeFragment,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import React from "react";
import { FormattedMessage } from "react-intl";

import { AddressTypeInput } from "../../types";

export interface CustomerAddressDialogProps {
  address: AddressFragment;
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  errors: AccountErrorFragment[];
  open: boolean;
  variant: "create" | "edit";
  onClose: () => void;
  onConfirm: (data: AddressInput) => void;
}

const CustomerAddressDialog: React.FC<CustomerAddressDialogProps> = ({
  address,
  confirmButtonState,
  countries,
  errors,
  open,
  variant,
  onClose,
  onConfirm,
}) => {
  const [countryDisplayName, setCountryDisplayName] = useStateFromProps(
    address?.country.country || "",
  );
  const { errors: validationErrors, submit: handleSubmit } = useAddressValidation(onConfirm);
  const dialogErrors = useModalDialogErrors([...errors, ...validationErrors], open);
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
    streetAddress2: address?.streetAddress2 || "",
  };
  const countryChoices = mapCountriesToChoices(countries || []);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <Form
        initial={initialForm}
        onSubmit={data => {
          setCountryDisplayName("");
          handleSubmit(data);
        }}
      >
        {({ change, set, data, submit }) => {
          const countrySelect = createSingleAutocompleteSelectHandler(
            change,
            setCountryDisplayName,
            countryChoices,
          );
          const handleCountrySelect = createCountryHandler(countrySelect, set);

          return (
            <DashboardModal.Content __maxWidth={DASHBOARD_MODAL_WIDTH} width="100%">
              <DashboardModal.Title>
                {variant === "create" ? (
                  <FormattedMessage
                    id="W0kQd+"
                    defaultMessage="Add Address"
                    description="dialog title"
                  />
                ) : (
                  <FormattedMessage
                    id="gQGUsN"
                    defaultMessage="Edit Address"
                    description="dialog title"
                  />
                )}
              </DashboardModal.Title>

              <AddressEdit
                countries={countryChoices}
                data={data}
                countryDisplayValue={countryDisplayName}
                errors={dialogErrors}
                onChange={change}
                onCountryChange={handleCountrySelect}
              />

              <DashboardModal.Actions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  onClick={submit}
                  data-test-id="submit"
                >
                  <FormattedMessage {...buttonMessages.save} />
                </ConfirmButton>
              </DashboardModal.Actions>
            </DashboardModal.Content>
          );
        }}
      </Form>
    </DashboardModal>
  );
};

CustomerAddressDialog.displayName = "CustomerAddressDialog";
export default CustomerAddressDialog;
