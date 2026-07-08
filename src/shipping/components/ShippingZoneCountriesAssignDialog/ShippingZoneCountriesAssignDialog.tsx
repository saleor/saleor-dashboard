import BackButton from "@dashboard/components/BackButton";
import { ChannelsAvailabilitySearchField } from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilitySearchField";
import {
  areSelectedChannelIdsEqual,
  useChannelsSearch,
} from "@dashboard/components/ChannelsAvailabilityDialog/utils";
import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type CountryWithCodeFragment } from "@dashboard/graphql";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { getCountrySelectionMap, isRestWorldCountriesSelected } from "@dashboard/shipping/handlers";
import { toggle } from "@dashboard/utils/lists";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { COUNTRY_PRESET_CODES, type CountryPresetCode } from "./countryPresets";
import { toggleRestOfTheWorldSelection } from "./handlers";
import { messages } from "./messages";
import { togglePresetSelection } from "./presetSelection";
import {
  ShippingZoneCountriesAssignDialogCountriesList,
  type ShippingZoneCountryPickerItem,
} from "./ShippingZoneCountriesAssignDialogCountriesList";
import { ShippingZoneCountriesAssignDialogQuickPicks } from "./ShippingZoneCountriesAssignDialogQuickPicks";

export interface ShippingZoneCountriesAssignFormData {
  countries: string[];
  query: string;
}

interface ShippingZoneCountriesAssignDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  restWorldCountries: string[];
  initial: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: ShippingZoneCountriesAssignFormData) => void;
}

const toCountryPickerItems = (
  countries: CountryWithCodeFragment[],
): ShippingZoneCountryPickerItem[] =>
  countries.map(country => ({
    id: country.code,
    name: country.country,
  }));

export const ShippingZoneCountriesAssignDialog = ({
  confirmButtonState,
  onClose,
  countries,
  restWorldCountries,
  open,
  initial,
  onConfirm,
}: ShippingZoneCountriesAssignDialogProps) => {
  const intl = useIntl();
  const countryItems = useMemo(() => toCountryPickerItems(countries), [countries]);
  const availableCountryCodes = useMemo(
    () => countryItems.map(country => country.id),
    [countryItems],
  );
  const [selectedCountryIds, setSelectedCountryIds] = useState(initial);
  const [baselineCountryIds, setBaselineCountryIds] = useState(initial);
  const {
    query,
    onQueryChange,
    resetQuery,
    filteredChannels: filteredCountries,
  } = useChannelsSearch(countryItems);
  const countrySelectionMap = getCountrySelectionMap(countries, selectedCountryIds);
  const isRestOfTheWorldSelected = Boolean(
    isRestWorldCountriesSelected(restWorldCountries, countrySelectionMap),
  );
  const hasCountries = countryItems.length > 0;
  const isCountrySelected = (country: ShippingZoneCountryPickerItem) =>
    selectedCountryIds.includes(country.id);
  const handleCountryToggle = (country: ShippingZoneCountryPickerItem) => {
    setSelectedCountryIds(currentSelected =>
      toggle(country.id, currentSelected, (leftId, rightId) => leftId === rightId),
    );
  };
  const hasSelectionChanged = !areSelectedChannelIdsEqual(selectedCountryIds, baselineCountryIds);
  const confirmButtonLabel = intl.formatMessage(messages.assignCountriesButton, {
    count: selectedCountryIds.length,
  });
  const handlePresetToggle = (preset: CountryPresetCode, checked: boolean) => {
    setSelectedCountryIds(currentSelected =>
      togglePresetSelection(
        currentSelected,
        COUNTRY_PRESET_CODES[preset],
        availableCountryCodes,
        checked,
      ),
    );
  };
  const handleRestOfTheWorldToggle = (checked: boolean) => {
    setSelectedCountryIds(currentSelected =>
      toggleRestOfTheWorldSelection(currentSelected, restWorldCountries, countries, checked),
    );
  };
  const handleClose = () => {
    setSelectedCountryIds(baselineCountryIds);
    resetQuery();
    onClose();
  };
  const handleConfirm = () => {
    onConfirm({
      countries: selectedCountryIds,
      query,
    });
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      setSelectedCountryIds(initial);
      setBaselineCountryIds(initial);
    },
    onClose: resetQuery,
  });

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm">
        <DashboardModal.PickerHeader
          description={<FormattedMessage {...messages.assignCountriesDescription} />}
          toolbar={
            hasCountries ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <ChannelsAvailabilitySearchField
                  query={query}
                  onQueryChange={onQueryChange}
                  label={intl.formatMessage(messages.searchCountriesLabel)}
                  placeholder={intl.formatMessage(messages.searchCountriesPlaceholder)}
                  inputTestId="search-country-input"
                />
                <ShippingZoneCountriesAssignDialogQuickPicks
                  availableCountryCodes={availableCountryCodes}
                  isRestOfTheWorldSelected={isRestOfTheWorldSelected}
                  selectedCountryIds={selectedCountryIds}
                  showRestOfTheWorld={restWorldCountries.length > 0}
                  onPresetToggle={handlePresetToggle}
                  onRestOfTheWorldToggle={handleRestOfTheWorldToggle}
                />
              </Box>
            ) : undefined
          }
        >
          <FormattedMessage {...messages.assignCountriesTitle} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill __overflowX="hidden">
          {filteredCountries.length ? (
            <ShippingZoneCountriesAssignDialogCountriesList
              countries={filteredCountries}
              isCountrySelected={isCountrySelected}
              onChange={handleCountryToggle}
            />
          ) : (
            <div className={listStyles.empty}>
              <FormattedMessage {...messages.notFoundTitle} />
            </div>
          )}
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} data-test-id="back-button" />
          <ConfirmButton
            transitionState={confirmButtonState}
            disabled={hasSelectionChanged === false}
            onClick={handleConfirm}
            data-test-id="assign-and-save-button"
          >
            {confirmButtonLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingZoneCountriesAssignDialog.displayName = "ShippingZoneCountriesAssignDialog";
