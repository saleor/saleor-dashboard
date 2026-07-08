import { AddressEdit } from "@dashboard/components/AddressEdit/AddressEdit";
import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { type AddressTypeInput } from "@dashboard/customers/types";
import {
  type AccountErrorFragment,
  type AddressFragment,
  type AddressInput,
  type CountryWithCodeFragment,
} from "@dashboard/graphql";
import useAddressValidation from "@dashboard/hooks/useAddressValidation";
import useModalDialogErrors from "@dashboard/hooks/useModalDialogErrors";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

interface CustomerAddressDialogProps {
  address?: AddressFragment;
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  errors: AccountErrorFragment[];
  onClose: () => void;
  onConfirm: (data: AddressInput) => void;
  open: boolean;
  variant: "create" | "edit";
}

export const CustomerAddressDialog = ({
  address,
  confirmButtonState,
  countries,
  errors,
  onClose,
  onConfirm,
  open,
  variant,
}: CustomerAddressDialogProps) => {
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    if (!open) {
      isSubmittingRef.current = false;
    }
  }, [open]);

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
  const isCreate = variant === "create";

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      {open ? (
        <Form
          initial={initialForm}
          key={`${variant}-${address?.id ?? "new"}`}
          onSubmit={data => {
            setCountryDisplayName("");
            handleSubmit(data);
          }}
        >
          {({ change, data, set, submit, isSubmitting }) => {
            const isMutationLoading = confirmButtonState === "loading";
            const isActionsDisabled = isSubmitting || isMutationLoading;

            isSubmittingRef.current = isActionsDisabled;

            const countrySelect = createSingleAutocompleteSelectHandler(
              change,
              setCountryDisplayName,
              countryChoices,
            );
            const handleCountrySelect = createCountryHandler(countrySelect, set);

            return (
              <DashboardModal.Content size="sm">
                <DashboardModal.ContextHeader>
                  {isCreate ? (
                    <FormattedMessage
                      description="dialog title"
                      id="W0kQd+"
                      defaultMessage="Add Address"
                    />
                  ) : (
                    <FormattedMessage
                      description="dialog title"
                      id="gQGUsN"
                      defaultMessage="Edit Address"
                    />
                  )}
                </DashboardModal.ContextHeader>

                <DashboardModal.Body fill>
                  <DashboardModal.Inset>
                    <AddressEdit
                      countries={countryChoices}
                      countryDisplayValue={countryDisplayName}
                      data={data}
                      disabled={isActionsDisabled}
                      errors={dialogErrors}
                      onChange={change}
                      onCountryChange={handleCountrySelect}
                    />
                  </DashboardModal.Inset>
                </DashboardModal.Body>

                <DashboardModal.Actions>
                  <BackButton disabled={isActionsDisabled} onClick={handleClose} />
                  <ConfirmButton
                    data-test-id="submit"
                    disabled={isActionsDisabled}
                    onClick={submit}
                    transitionState={
                      isMutationLoading ? confirmButtonState : isSubmitting ? "loading" : "default"
                    }
                  >
                    <FormattedMessage {...buttonMessages.save} />
                  </ConfirmButton>
                </DashboardModal.Actions>
              </DashboardModal.Content>
            );
          }}
        </Form>
      ) : null}
    </DashboardModal>
  );
};

CustomerAddressDialog.displayName = "CustomerAddressDialog";
