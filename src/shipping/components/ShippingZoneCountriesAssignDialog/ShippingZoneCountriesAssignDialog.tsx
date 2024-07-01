// @ts-strict-ignore
import BackButton from "@dashboard/components/BackButton";
import Checkbox from "@dashboard/components/Checkbox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Form from "@dashboard/components/Form";
import FormSpacer from "@dashboard/components/FormSpacer";
import Hr from "@dashboard/components/Hr";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import { CountryWithCodeFragment } from "@dashboard/graphql";
import { fuzzySearch } from "@dashboard/misc";
import { getCountrySelectionMap, isRestWorldCountriesSelected } from "@dashboard/shipping/handlers";
import useScrollableDialogStyle from "@dashboard/styles/useScrollableDialogStyle";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TextField,
  Typography,
} from "@material-ui/core";
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

const ShippingZoneCountriesAssignDialog: React.FC<
  ShippingZoneCountriesAssignDialogProps
> = props => {
  const { confirmButtonState, onClose, countries, restWorldCountries, open, initial, onConfirm } =
    props;
  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle();
  const intl = useIntl();
  const initialForm: FormData = {
    countries: initial,
    query: "",
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form initial={initialForm} onSubmit={onConfirm} className={scrollableDialogClasses.form}>
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
            <>
              <DialogTitle disableTypography>
                <FormattedMessage {...messages.assignCountriesTitle} />
              </DialogTitle>
              <DialogContent>
                <Typography>
                  <FormattedMessage {...messages.assignCountriesDescription} />
                </Typography>
                <FormSpacer />
                <TextField
                  name="query"
                  data-test-id="search-country-input"
                  value={data.query}
                  onChange={event => change(event)}
                  label={intl.formatMessage(messages.searchCountriesLabel)}
                  placeholder={intl.formatMessage(messages.searchCountriesPlaceholder)}
                  fullWidth
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                {restWorldCountries.length > 0 && (
                  <>
                    <Typography variant="subtitle1">
                      <FormattedMessage {...messages.quickPickSubtitle} />
                    </Typography>
                    <FormSpacer />
                    <ResponsiveTable className={classes.table}>
                      <TableBody>
                        <TableRowLink
                          data-test-id="rest-of-the-world-row"
                          className={classes.clickableRow}
                          onClick={() => handleRestOfTheWorldChange(!isRestOfTheWorldSelected)}
                        >
                          <TableCell className={classes.wideCell}>
                            <FormattedMessage {...messages.restOfTheWorldCheckbox} />
                            <Typography variant="caption">
                              <FormattedMessage {...messages.restOfTheWorldCheckboxDescription} />
                            </Typography>
                          </TableCell>
                          <TableCell padding="checkbox" className={classes.checkboxCell}>
                            <Checkbox name="restOfTheWorld" checked={isRestOfTheWorldSelected} />
                          </TableCell>
                        </TableRowLink>
                      </TableBody>
                    </ResponsiveTable>
                    <FormSpacer />
                  </>
                )}
                <Typography variant="subtitle1">
                  <FormattedMessage {...messages.countriesSubtitle} />
                </Typography>
              </DialogContent>
              <DialogContent className={scrollableDialogClasses.scrollArea}>
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
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} data-test-id="back-button" />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  type="submit"
                  data-test-id="assign-and-save-button"
                >
                  <FormattedMessage {...messages.assignCountriesButton} />
                </ConfirmButton>
              </DialogActions>
            </>
          );
        }}
      </Form>
    </Dialog>
  );
};

ShippingZoneCountriesAssignDialog.displayName = "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
