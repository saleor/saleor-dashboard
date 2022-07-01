import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { CountryWithCodeFragment } from "@saleor/graphql";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import {
  getCountrySelectionMap,
  isRestWorldCountriesSelected,
} from "@saleor/shipping/handlers";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  createCountryChangeHandler,
  createRestOfTheWorldChangeHandler,
} from "./handlers";
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

const ShippingZoneCountriesAssignDialog: React.FC<ShippingZoneCountriesAssignDialogProps> = props => {
  const {
    confirmButtonState,
    onClose,
    countries,
    restWorldCountries,
    open,
    initial,
    onConfirm,
  } = props;

  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle();
  const intl = useIntl();

  const initialForm: FormData = {
    countries: initial,
    query: "",
  };

  return (
    <Dialog onClose={onClose} open={open} fullWidth maxWidth="sm">
      <Form
        initial={initialForm}
        onSubmit={onConfirm}
        className={scrollableDialogClasses.form}
      >
        {({ data, change }) => {
          const countrySelectionMap = getCountrySelectionMap(
            countries,
            data.countries,
          );
          const isRestOfTheWorldSelected = isRestWorldCountriesSelected(
            restWorldCountries,
            countrySelectionMap,
          );
          const handleCountryChange = createCountryChangeHandler(
            data.countries,
            change,
          );
          const handleRestOfTheWorldChange = createRestOfTheWorldChangeHandler(
            countrySelectionMap,
            data.countries,
            restWorldCountries,
            change,
          );

          return (
            <>
              <DialogTitle>
                <FormattedMessage {...messages.assignCountriesTitle} />
              </DialogTitle>
              <DialogContent>
                <Typography>
                  <FormattedMessage {...messages.assignCountriesDescription} />
                </Typography>
                <FormSpacer />
                <TextField
                  name="query"
                  value={data.query}
                  onChange={event => change(event)}
                  label={intl.formatMessage(messages.searchCountriesLabel)}
                  placeholder={intl.formatMessage(
                    messages.searchCountriesPlaceholder,
                  )}
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
                        <TableRow
                          className={classes.clickableRow}
                          onClick={() =>
                            handleRestOfTheWorldChange(
                              !isRestOfTheWorldSelected,
                            )
                          }
                        >
                          <TableCell className={classes.wideCell}>
                            <FormattedMessage
                              {...messages.restOfTheWorldCheckbox}
                            />
                            <Typography variant="caption">
                              <FormattedMessage
                                {...messages.restOfTheWorldCheckboxDescription}
                              />
                            </Typography>
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            className={classes.checkboxCell}
                          >
                            <Checkbox
                              name="restOfTheWorld"
                              checked={isRestOfTheWorldSelected}
                            />
                          </TableCell>
                        </TableRow>
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
                    {filter(countries, data.query, {
                      key: "country",
                    }).map(country => {
                      const isChecked = countrySelectionMap[country.code];

                      return (
                        <TableRow
                          className={classes.clickableRow}
                          onClick={() =>
                            handleCountryChange(country.code, !isChecked)
                          }
                          key={country.code}
                        >
                          <TableCell className={classes.wideCell}>
                            {country.country}
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            className={classes.checkboxCell}
                          >
                            <Checkbox checked={isChecked} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </ResponsiveTable>
              </DialogContent>
              <DialogActions>
                <BackButton onClick={onClose} />
                <ConfirmButton
                  transitionState={confirmButtonState}
                  type="submit"
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
ShippingZoneCountriesAssignDialog.displayName =
  "ShippingZoneCountriesAssignDialog";
export default ShippingZoneCountriesAssignDialog;
