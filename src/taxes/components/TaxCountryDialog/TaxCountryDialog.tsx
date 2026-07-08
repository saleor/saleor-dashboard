// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import { ChannelsAvailabilitySearchField } from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilitySearchField";
import { useChannelsSearch } from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type CountryFragment } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { TaxCountryDialogCountriesList } from "./TaxCountryDialogCountriesList";

interface TaxCountryDialogProps {
  countries: CountryFragment[];
  onClose: () => void;
  onConfirm: (country: CountryFragment) => void;
  open: boolean;
}

const toCountryPickerItems = (countries: CountryFragment[]) =>
  countries.map(country => ({
    id: country.code,
    name: country.country,
  }));

export const TaxCountryDialog = ({
  countries,
  onClose,
  onConfirm,
  open,
}: TaxCountryDialogProps): JSX.Element => {
  const intl = useIntl();
  const countryItems = useMemo(() => toCountryPickerItems(countries), [countries]);
  const countriesByCode = useMemo(
    () => new Map(countries.map(country => [country.code, country])),
    [countries],
  );
  const [selectedCountryId, setSelectedCountryId] = useState<string>();
  const {
    filteredChannels: filteredCountries,
    onQueryChange,
    query,
    resetQuery,
  } = useChannelsSearch(countryItems);
  const hasCountries = countryItems.length > 0;

  useModalDialogOpen(open, {
    onOpen: () => {
      setSelectedCountryId(undefined);
      resetQuery();
    },
    onClose: () => {
      setSelectedCountryId(undefined);
      resetQuery();
    },
  });

  const handleConfirm = (): void => {
    if (!selectedCountryId) {
      return;
    }

    const country = countriesByCode.get(selectedCountryId);

    if (country) {
      onConfirm(country);
    }
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      {open ? (
        <DashboardModal.Content size="sm">
          <DashboardModal.PickerHeader
            toolbar={
              hasCountries ? (
                <ChannelsAvailabilitySearchField
                  inputTestId="search-country-input"
                  label={intl.formatMessage(taxesMessages.country)}
                  onQueryChange={onQueryChange}
                  placeholder={intl.formatMessage(taxesMessages.country)}
                  query={query}
                />
              ) : undefined
            }
          >
            <FormattedMessage {...taxesMessages.chooseCountryDialogTitle} />
          </DashboardModal.PickerHeader>

          <DashboardModal.Body fill __overflowX="hidden">
            {hasCountries && filteredCountries.length ? (
              <TaxCountryDialogCountriesList
                countries={filteredCountries}
                onSelect={country => setSelectedCountryId(country.id)}
                selectedCountryId={selectedCountryId}
              />
            ) : (
              <div className={listStyles.empty}>
                <FormattedMessage {...taxesMessages.chooseCountryNotFound} />
              </div>
            )}
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton onClick={onClose} />
            <ConfirmButton
              data-test-id="add-button"
              disabled={!selectedCountryId}
              onClick={handleConfirm}
              transitionState="default"
            >
              <FormattedMessage {...buttonMessages.add} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      ) : null}
    </DashboardModal>
  );
};

TaxCountryDialog.displayName = "TaxCountryDialog";
