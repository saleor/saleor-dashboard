import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import BackButton from "@dashboard/components/BackButton";
import { CompanyAddressForm } from "@dashboard/components/CompanyAddressInput/CompanyAddressForm";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton/ConfirmButton";
import Form from "@dashboard/components/Form/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import { type AddressTypeInput } from "@dashboard/customers/types";
import { type CountryFragment, type WarehouseErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { transformFormToAddressInput } from "@dashboard/misc";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, Input } from "@saleor/macaw-ui-next";
import { type ReactNode, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateWarehouseFormData extends AddressTypeInput {
  name: string;
}

interface CreateWarehouseDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryFragment[];
  defaultCountryCode: string;
  disabled?: boolean;
  errors: WarehouseErrorFragment[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWarehouseFormData) => SubmitPromise<WarehouseErrorFragment[]>;
  /** When set, the warehouse is created for this channel and assigned to it. */
  channelName?: string;
}

export const CreateWarehouseDialog = ({
  channelName,
  confirmButtonState,
  countries,
  defaultCountryCode,
  disabled = false,
  errors: apiErrors,
  open,
  onClose,
  onSubmit,
}: CreateWarehouseDialogProps): ReactNode => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<WarehouseErrorFragment[]>([]);
  const [formKey, setFormKey] = useState(0);
  const countryChoices = useMemo(() => mapCountriesToChoices(countries || []), [countries]);
  const defaultCountryLabel =
    countries.find(country => country.code === defaultCountryCode)?.country || "";
  const [displayCountry, setDisplayCountry] = useStateFromProps(defaultCountryLabel);

  const initialForm: CreateWarehouseFormData = {
    name: "",
    companyName: "",
    streetAddress1: "",
    streetAddress2: "",
    city: "",
    cityArea: "",
    postalCode: "",
    country: defaultCountryCode || "",
    countryArea: "",
    phone: "",
  };

  useModalDialogOpen(open, {
    onClose: () => setSubmitErrors([]),
    onOpen: () => {
      setSubmitErrors([]);
      setFormKey(current => current + 1);
      setDisplayCountry(defaultCountryLabel);
    },
  });

  const displayedErrors = [...apiErrors, ...submitErrors];

  const handleSubmit = async (data: CreateWarehouseFormData): Promise<WarehouseErrorFragment[]> => {
    const payload = transformFormToAddressInput(data);
    const errors = await onSubmit(payload);

    setSubmitErrors(errors ?? []);

    return errors ?? [];
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <Form key={formKey} initial={initialForm} onSubmit={handleSubmit} disabled={disabled}>
          {({ change, data, set, submit }) => {
            const countrySelect = createSingleAutocompleteSelectHandler(
              change,
              setDisplayCountry,
              countryChoices,
            );
            const handleCountrySelect = createCountryHandler(countrySelect, set);
            const title = <FormattedMessage {...messages.title} />;
            const description = (
              <FormattedMessage
                {...(channelName ? messages.descriptionForChannel : messages.description)}
              />
            );

            return (
              <DashboardModal.Content
                size="md"
                data-test-id={
                  channelName ? "create-warehouse-for-channel-dialog" : "create-warehouse-dialog"
                }
              >
                {channelName ? (
                  <DashboardModal.ContextHeader
                    contextLabel={channelName}
                    description={description}
                  >
                    {title}
                  </DashboardModal.ContextHeader>
                ) : (
                  <DashboardModal.Header subtitle={description}>{title}</DashboardModal.Header>
                )}

                <DashboardModal.Body>
                  <DashboardModal.Inset>
                    <Box display="flex" flexDirection="column" gap={5}>
                      <Input
                        name="name"
                        label={intl.formatMessage(messages.name)}
                        value={data.name}
                        onChange={change}
                        disabled={disabled}
                        data-test-id="warehouse-name-input"
                      />

                      <Box display="flex" flexDirection="column" gap={3}>
                        <ModalSectionHeader>
                          <FormattedMessage {...messages.addressSection} />
                        </ModalSectionHeader>
                        <CompanyAddressForm
                          countries={countryChoices}
                          data={data}
                          disabled={disabled}
                          displayCountry={displayCountry}
                          errors={displayedErrors}
                          onChange={change}
                          onCountryChange={handleCountrySelect}
                        />
                      </Box>
                    </Box>
                  </DashboardModal.Inset>
                </DashboardModal.Body>

                <DashboardModal.Actions>
                  <BackButton onClick={onClose} />
                  <ConfirmButton
                    transitionState={confirmButtonState}
                    onClick={submit}
                    disabled={disabled || !data.name.trim() || !data.country}
                    data-test-id="submit"
                  >
                    <FormattedMessage
                      {...(channelName ? messages.submitForChannel : messages.submit)}
                    />
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

CreateWarehouseDialog.displayName = "CreateWarehouseDialog";
