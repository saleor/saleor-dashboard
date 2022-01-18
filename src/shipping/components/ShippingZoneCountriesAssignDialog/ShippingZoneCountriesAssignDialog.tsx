import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Typography
} from "@material-ui/core";
import BackButton from "@saleor/components/BackButton";
import Checkbox from "@saleor/components/Checkbox";
import ConfirmButton from "@saleor/components/ConfirmButton";
import Form from "@saleor/components/Form";
import FormSpacer from "@saleor/components/FormSpacer";
import Hr from "@saleor/components/Hr";
import ResponsiveTable from "@saleor/components/ResponsiveTable";
import { ShopInfo_shop_countries } from "@saleor/components/Shop/types/ShopInfo";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import {
  getCountrySelectionMap,
  isRestWorldCountriesSelected
} from "@saleor/shipping/handlers";
import useScrollableDialogStyle from "@saleor/styles/useScrollableDialogStyle";
import { filter } from "fuzzaldrin";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import {
  createCountryChangeHandler,
  createRestOfTheWorldChangeHandler
} from "./handlers";
import { useStyles } from "./styles";

interface FormData {
  countries: string[];
  query: string;
}

export interface ShippingZoneCountriesAssignDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  countries: ShopInfo_shop_countries[];
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
    onConfirm
  } = props;

  const classes = useStyles(props);
  const scrollableDialogClasses = useScrollableDialogStyle();
  const intl = useIntl();

  const initialForm: FormData = {
    countries: initial,
    query: ""
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
            data.countries
          );
          const restOfTheWorld = isRestWorldCountriesSelected(
            restWorldCountries,
            countrySelectionMap
          );
          const handleCountryChange = createCountryChangeHandler(
            data.countries,
            change
          );
          const handleRestOfTheWorldChange = createRestOfTheWorldChangeHandler(
            countrySelectionMap,
            data.countries,
            restWorldCountries,
            change
          );

          return (
            <>
              <DialogTitle>
                <FormattedMessage
                  defaultMessage="Assign Countries"
                  description="dialog header"
                />
              </DialogTitle>
              <DialogContent>
                <Typography>
                  <FormattedMessage defaultMessage="Choose countries you want to add to shipping zone from list below" />
                </Typography>
                <FormSpacer />
                <TextField
                  name="query"
                  value={data.query}
                  onChange={event => change(event, () => fetch(data.query))}
                  label={intl.formatMessage({
                    defaultMessage: "Search Countries"
                  })}
                  placeholder={intl.formatMessage({
                    defaultMessage: "Search by country name"
                  })}
                  fullWidth
                />
                <FormSpacer />
                <Hr />
                <FormSpacer />
                <Typography variant="subtitle1">
                  <FormattedMessage defaultMessage="Quick Pick" />
                </Typography>
                <FormSpacer />
                <ResponsiveTable className={classes.table}>
                  <TableBody>
                    <TableRow>
                      <TableCell className={classes.wideCell}>
                        <FormattedMessage defaultMessage="Rest of the World" />
                        <Typography variant="caption">
                          <FormattedMessage defaultMessage="If selected, this will add all of the countries not selected to other shipping zones" />
                        </Typography>
                      </TableCell>
                      <TableCell
                        padding="checkbox"
                        className={classes.checkboxCell}
                      >
                        <Checkbox
                          name="restOfTheWorld"
                          checked={restOfTheWorld}
                          onChange={() =>
                            handleRestOfTheWorldChange(!restOfTheWorld)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </ResponsiveTable>
                <FormSpacer />
                <Typography variant="subtitle1">
                  <FormattedMessage
                    defaultMessage="Countries A to Z"
                    description="country selection"
                  />
                </Typography>
              </DialogContent>
              <DialogContent className={scrollableDialogClasses.scrollArea}>
                <ResponsiveTable className={classes.table}>
                  <TableBody>
                    {filter(countries, data.query, {
                      key: "country"
                    }).map(country => {
                      const isChecked = countrySelectionMap[country.code];

                      return (
                        <TableRow key={country.code}>
                          <TableCell className={classes.wideCell}>
                            {country.country}
                          </TableCell>
                          <TableCell
                            padding="checkbox"
                            className={classes.checkboxCell}
                          >
                            <Checkbox
                              checked={isChecked}
                              onChange={() =>
                                handleCountryChange(country.code, !isChecked)
                              }
                            />
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
                  <FormattedMessage
                    defaultMessage="Assign countries"
                    description="button"
                  />
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
