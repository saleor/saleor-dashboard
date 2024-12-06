import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import Hr from "@dashboard/components/Hr";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CountryWithCodeFragment } from "@dashboard/graphql";
import { fuzzySearch } from "@dashboard/misc";
import { getCountrySelectionMap, isRestWorldCountriesSelected } from "@dashboard/shipping/handlers";
import { TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { createCountryChangeHandler, createRestOfTheWorldChangeHandler } from "./handlers";
import { messages } from "./messages";
import { useStyles } from "./styles";

interface FormData {
  countries: string[];
  query: string;
}

export interface ShippingZoneCountriesAssignDialogProps {
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
  const classes = useStyles(props);
  const intl = useIntl();
  const initialForm: FormData = {
    countries: initial,
    query: "",
  };

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm">
        <Form initial={initialForm} onSubmit={onConfirm}>
          {({ data, change }) => {
            const countrySelectionMap = getCountrySelectionMap(countries, data.countries);
            const isRestOfTheWorldSelected = isRestWorldCountriesSelected(
              restWorldCountries,
              countrySelectionMap,
            );
            const handleCountryChange = createCountryChangeHandler(data.countries, change);
            const handleRestOfTheWorldChange = createRestOfTheWorldChangeHandler(
              countrySelectionMap,
              data.countries,
              restWorldCountries,
              change,
            );
            const displayCountries = fuzzySearch(countries, data.query, ["country"]);

            return (
              <DashboardModal.Grid>
                <DashboardModal.Header>
                  <FormattedMessage {...messages.assignCountriesTitle} />
                </DashboardModal.Header>

                <Text>
                  <FormattedMessage {...messages.assignCountriesDescription} />
                </Text>

                <TextField
                  name="query"
                  data-test-id="search-country-input"
                  value={data.query}
                  onChange={event => change(event)}
                  label={intl.formatMessage(messages.searchCountriesLabel)}
                  placeholder={intl.formatMessage(messages.searchCountriesPlaceholder)}
                  fullWidth
                />

                <Hr />

                {restWorldCountries.length > 0 && (
                  <>
                    <Text fontSize={3}>
                      <FormattedMessage {...messages.quickPickSubtitle} />
                    </Text>

                    <ResponsiveTable className={classes.table}>
                      <TableBody>
                        <TableRowLink
                          data-test-id="rest-of-the-world-row"
                          className={classes.clickableRow}
                          onClick={() => handleRestOfTheWorldChange(!isRestOfTheWorldSelected)}
                        >
                          <TableCell className={classes.wideCell}>
                            <FormattedMessage {...messages.restOfTheWorldCheckbox} />
                            <Text size={2} fontWeight="light">
                              <FormattedMessage {...messages.restOfTheWorldCheckboxDescription} />
                            </Text>
                          </TableCell>
                          <TableCell padding="checkbox" className={classes.checkboxCell}>
                            <Checkbox name="restOfTheWorld" checked={isRestOfTheWorldSelected} />
                          </TableCell>
                        </TableRowLink>
                      </TableBody>
                    </ResponsiveTable>
                  </>
                )}

                <Text fontSize={3}>
                  <FormattedMessage {...messages.countriesSubtitle} />
                </Text>

                <Box overflowY="auto" __maxHeight="calc(100vh - 580px)">
                  <ResponsiveTable className={classes.table}>
                    <TableBody>
                      {displayCountries.map(country => {
                        const isChecked = countrySelectionMap[country.code];

                        return (
                          <TableRowLink
                            data-test-id="country-row"
                            className={classes.clickableRow}
                            onClick={() => handleCountryChange(country.code, !isChecked)}
                            key={country.code}
                          >
                            <TableCell className={classes.wideCell}>{country.country}</TableCell>
                            <TableCell padding="checkbox" className={classes.checkboxCell}>
                              <Checkbox checked={isChecked} />
                            </TableCell>
                          </TableRowLink>
                        );
                      })}
                    </TableBody>
                  </ResponsiveTable>
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
            );
          }}
        </Form>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ShippingZoneCountriesAssignDialog.displayName = "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
