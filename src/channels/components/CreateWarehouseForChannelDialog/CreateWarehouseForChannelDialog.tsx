import { createCountryHandler } from "@dashboard/components/AddressEdit/createCountryHandler";
import BackButton from "@dashboard/components/BackButton";
import { CompanyAddressForm } from "@dashboard/components/CompanyAddressInput/CompanyAddressForm";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import { DashboardModal } from "@dashboard/components/Modal";
import { ModalSectionHeader } from "@dashboard/components/Modal/ModalSectionHeader";
import { type AddressTypeInput } from "@dashboard/customers/types";
import { type CountryFragment, type WarehouseErrorFragment } from "@dashboard/graphql";
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { transformFormToAddressInput } from "@dashboard/misc";
import createSingleAutocompleteSelectHandler from "@dashboard/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapCountriesToChoices } from "@dashboard/utils/maps";
import { Box, Input } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface CreateWarehouseForChannelFormData extends AddressTypeInput {
  name: string;
}

interface CreateWarehouseForChannelDialogProps {
  channelName: string;
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryFragment[];
  defaultCountryCode: string;
  disabled?: boolean;
  errors: WarehouseErrorFragment[];
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateWarehouseForChannelFormData) => SubmitPromise<WarehouseErrorFragment[]>;
}

export const CreateWarehouseForChannelDialog = ({
  channelName,
  confirmButtonState,
  countries,
  defaultCountryCode,
  disabled = false,
  errors: apiErrors,
  open,
  onClose,
  onSubmit,
}: CreateWarehouseForChannelDialogProps) => {
  const intl = useIntl();
  const [submitErrors, setSubmitErrors] = useState<WarehouseErrorFragment[]>([]);
  const [formKey, setFormKey] = useState(0);
  const countryChoices = useMemo(() => mapCountriesToChoices(countries || []), [countries]);
  const defaultCountryLabel =
    countries.find(country => country.code === defaultCountryCode)?.country || "";
  const [displayCountry, setDisplayCountry] = useStateFromProps(defaultCountryLabel);

  const initialForm: CreateWarehouseForChannelFormData = {
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

  const handleSubmit = async (
    data: CreateWarehouseForChannelFormData,
  ): Promise<WarehouseErrorFragment[]> => {
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

            return (
              <DashboardModal.Content size="md" data-test-id="create-warehouse-for-channel-dialog">
                <DashboardModal.ContextHeader
                  contextLabel={channelName}
                  description={<FormattedMessage {...messages.description} />}
                >
                  <FormattedMessage {...messages.title} />
                </DashboardModal.ContextHeader>

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
                    disabled={disabled || !data.name.trim()}
                    data-test-id="submit"
                  >
                    <FormattedMessage {...messages.submit} />
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
