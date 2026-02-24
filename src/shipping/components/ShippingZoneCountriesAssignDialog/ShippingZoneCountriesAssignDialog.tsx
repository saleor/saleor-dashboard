import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Hr from "@dashboard/components/Hr";
import { DashboardModal } from "@dashboard/components/Modal";
import { CountryWithCodeFragment } from "@dashboard/graphql";
import { fuzzySearch } from "@dashboard/misc";
import { getCountrySelectionMap, isRestWorldCountriesSelected } from "@dashboard/shipping/handlers";
import { Box, Checkbox, Input, Text } from "@saleor/macaw-ui-next";
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { createCountryChangeHandler, createRestOfTheWorldChangeHandler } from "./handlers";
import { messages } from "./messages";
import styles from "./ShippingZoneCountriesAssignDialog.module.css";

interface FormData {
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
  onConfirm: (data: FormData) => void;
}

const ShippingZoneCountriesAssignDialog = (props: ShippingZoneCountriesAssignDialogProps) => {
  const { confirmButtonState, onClose, countries, restWorldCountries, open, initial, onConfirm } =
    props;
  const intl = useIntl();

  const { watch, setValue, getValues, handleSubmit } = useForm<FormData>({
    defaultValues: {
      countries: initial,
      query: "",
    },
  });

  const data = watch();
  const countrySelectionMap = getCountrySelectionMap(countries, data.countries);
  const isRestOfTheWorldSelected = isRestWorldCountriesSelected(
    restWorldCountries,
    countrySelectionMap,
  );
  const handleCountryChange = createCountryChangeHandler(getValues, setValue);
  const handleRestOfTheWorldChange = createRestOfTheWorldChangeHandler(
    countrySelectionMap,
    getValues,
    restWorldCountries,
    setValue,
  );
  const displayCountries = fuzzySearch(countries, data.query, ["country"]);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <form onSubmit={handleSubmit(onConfirm)}>
          <DashboardModal.Grid>
            <DashboardModal.Header>
              <FormattedMessage {...messages.assignCountriesTitle} />
            </DashboardModal.Header>

            <Text>
              <FormattedMessage {...messages.assignCountriesDescription} />
            </Text>

            <Input
              name="query"
              data-test-id="search-country-input"
              value={data.query}
              onChange={e => setValue("query", e.target.value)}
              label={intl.formatMessage(messages.searchCountriesLabel)}
              placeholder={intl.formatMessage(messages.searchCountriesPlaceholder)}
              width="100%"
            />

            <Hr />

            {restWorldCountries.length > 0 && (
              <>
                <Text fontSize={3}>
                  <FormattedMessage {...messages.quickPickSubtitle} />
                </Text>

                <Box
                  display="flex"
                  alignItems="center"
                  paddingX={3}
                  paddingY={2}
                  className={styles.clickableRow}
                  data-test-id="rest-of-the-world-row"
                  onClick={() => handleRestOfTheWorldChange(!isRestOfTheWorldSelected)}
                >
                  <Box flexGrow="1" paddingY={2}>
                    <Text size={3} display="block">
                      <FormattedMessage {...messages.restOfTheWorldCheckbox} />
                    </Text>
                    <Text size={2} fontWeight="light">
                      <FormattedMessage {...messages.restOfTheWorldCheckboxDescription} />
                    </Text>
                  </Box>
                  <Checkbox name="restOfTheWorld" checked={isRestOfTheWorldSelected} />
                </Box>
              </>
            )}

            <Text fontSize={3}>
              <FormattedMessage {...messages.countriesSubtitle} />
            </Text>

            <Box overflowY="auto" __maxHeight="300px">
              <Box display="flex" flexDirection="column">
                {displayCountries.map(country => {
                  const isChecked = countrySelectionMap[country.code];

                  return (
                    <Box
                      key={country.code}
                      display="flex"
                      alignItems="center"
                      paddingX={3}
                      paddingY={2}
                      className={styles.clickableRow}
                      data-test-id="country-row"
                      onClick={() => handleCountryChange(country.code, !isChecked)}
                    >
                      <Box flexGrow="1">{country.country}</Box>
                      <Checkbox checked={isChecked} />
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <DashboardModal.Actions>
              <BackButton onClick={onClose} data-test-id="back-button" />
              <ConfirmButton
                transitionState={confirmButtonState}
                type="submit"
                data-test-id="assign-and-save-button"
              >
                <FormattedMessage {...messages.assignCountriesButton} />
              </ConfirmButton>
            </DashboardModal.Actions>
          </DashboardModal.Grid>
        </form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingZoneCountriesAssignDialog.displayName = "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
