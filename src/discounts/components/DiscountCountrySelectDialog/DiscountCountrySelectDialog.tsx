import BackButton from "@dashboard/components/BackButton";
import { ChannelsAvailabilitySearchField } from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilitySearchField";
import { ChannelsAvailabilitySelectAll } from "@dashboard/components/ChannelsAvailabilityDialog/ChannelsAvailabilitySelectAll";
import { useChannelsSelectAll } from "@dashboard/components/ChannelsAvailabilityDialog/useChannelsSelectAll";
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
import { type SubmitPromise } from "@dashboard/hooks/useForm";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { toggle } from "@dashboard/utils/lists";
import { Box } from "@saleor/macaw-ui-next";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  type CountryPickerItem,
  DiscountCountrySelectDialogCountriesList,
} from "./DiscountCountrySelectDialogCountriesList";
import { discountCountrySelectDialogMessages } from "./messages";

export interface DiscountCountrySelectFormData {
  allCountries: boolean;
  countries: string[];
  query: string;
}

interface DiscountCountrySelectDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: CountryWithCodeFragment[];
  initial: string[];
  open: boolean;
  onClose: () => void;
  onConfirm: (data: DiscountCountrySelectFormData) => SubmitPromise;
  labels?: {
    confirmBtn?: string;
  };
}

const toCountryPickerItems = (countries: CountryWithCodeFragment[]): CountryPickerItem[] =>
  countries.map(country => ({
    id: country.code,
    name: country.country,
  }));

const DiscountCountrySelectDialog = ({
  confirmButtonState,
  onClose,
  countries,
  open,
  initial,
  onConfirm,
  labels,
}: DiscountCountrySelectDialogProps) => {
  const intl = useIntl();
  const countryItems = useMemo(() => toCountryPickerItems(countries), [countries]);
  const [selectedCountryIds, setSelectedCountryIds] = useState(initial);
  const [baselineCountryIds, setBaselineCountryIds] = useState(initial);
  const {
    query,
    onQueryChange,
    resetQuery,
    filteredChannels: filteredCountries,
  } = useChannelsSearch(countryItems);
  const hasCountries = countryItems.length > 0;
  const isCountrySelected = (country: CountryPickerItem) => selectedCountryIds.includes(country.id);
  const handleCountryToggle = (country: CountryPickerItem) => {
    setSelectedCountryIds(currentSelected =>
      toggle(country.id, currentSelected, (leftId, rightId) => leftId === rightId),
    );
  };
  const toggleAllCountries = (items: CountryPickerItem[], selectedCount: number) => {
    if (selectedCount !== items.length) {
      setSelectedCountryIds(items.map(item => item.id));
    } else {
      setSelectedCountryIds([]);
    }
  };
  const { hasAllVisibleSelected, handleToggleAll, isSearchActive } = useChannelsSelectAll({
    channels: countryItems,
    filteredChannels: filteredCountries,
    query,
    isSelected: isCountrySelected,
    onChange: handleCountryToggle,
    selected: selectedCountryIds.length,
    toggleAll: toggleAllCountries,
  });
  const hasSelectionChanged = !areSelectedChannelIdsEqual(selectedCountryIds, baselineCountryIds);
  const confirmButtonLabel =
    labels?.confirmBtn ??
    intl.formatMessage(discountCountrySelectDialogMessages.assignCountedButton, {
      count: selectedCountryIds.length,
    });
  const handleClose = () => {
    setSelectedCountryIds(baselineCountryIds);
    resetQuery();
    onClose();
  };
  const handleConfirm = () => {
    void onConfirm({
      allCountries: true,
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
          description={<FormattedMessage {...discountCountrySelectDialogMessages.description} />}
          toolbar={
            hasCountries ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <ChannelsAvailabilitySearchField
                  query={query}
                  onQueryChange={onQueryChange}
                  label={intl.formatMessage(discountCountrySelectDialogMessages.searchLabel)}
                  placeholder={intl.formatMessage(
                    discountCountrySelectDialogMessages.searchPlaceholder,
                  )}
                  inputTestId="search-country-input"
                />
                <ChannelsAvailabilitySelectAll
                  checked={hasAllVisibleSelected}
                  inPickerToolbar
                  isSearchActive={isSearchActive}
                  onToggle={handleToggleAll}
                />
              </Box>
            ) : undefined
          }
        >
          <FormattedMessage {...discountCountrySelectDialogMessages.title} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill __overflowX="hidden">
          {filteredCountries.length ? (
            <DiscountCountrySelectDialogCountriesList
              countries={filteredCountries}
              isCountrySelected={isCountrySelected}
              onChange={handleCountryToggle}
            />
          ) : (
            <div className={listStyles.empty}>
              <FormattedMessage {...discountCountrySelectDialogMessages.notFoundTitle} />
            </div>
          )}
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton onClick={handleClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            disabled={hasSelectionChanged === false}
            onClick={handleConfirm}
            data-test-id="submit"
          >
            {confirmButtonLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

DiscountCountrySelectDialog.displayName = "DiscountCountrySelectDialog";
export default DiscountCountrySelectDialog;
