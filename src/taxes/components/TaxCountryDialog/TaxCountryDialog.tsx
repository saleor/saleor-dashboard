// @ts-strict-ignore
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { CountryFragment } from "@dashboard/graphql";
import { useLocalSearch } from "@dashboard/hooks/useLocalSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  FormControlLabel,
  InputAdornment,
  Radio,
  TextField,
} from "@material-ui/core";
import { DialogHeader, SearchIcon } from "@saleor/macaw-ui";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface TaxCountryDialogProps {
  open: boolean;
  countries: CountryFragment[];
  onConfirm: (countries: CountryFragment) => void;
  onClose: () => void;
}

export const TaxCountryDialog: React.FC<TaxCountryDialogProps> = ({
  open,
  countries,
  onConfirm,
  onClose,
}) => {
  const classes = useStyles();
  const intl = useIntl();
  const [selectedCountry, setSelectedCountry] = React.useState<CountryFragment>();

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedCountry(undefined);
      setQuery("");
    },
  });

  const {
    query,
    setQuery,
    searchResult: filteredCountries,
  } = useLocalSearch<CountryFragment>(countries, country => country.country);

  return (
    <Dialog open={open} fullWidth onClose={onClose} className={classes.dialog}>
      <DialogHeader onClose={onClose}>
        <FormattedMessage {...taxesMessages.chooseCountryDialogTitle} />
      </DialogHeader>
      <DialogContent className={classes.wrapper}>
        <TextField
          data-test-id="search-country-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          variant="outlined"
          placeholder={intl.formatMessage(taxesMessages.country)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{ className: classes.inputPadding }}
        />
        <VerticalSpacer spacing={2} />
        <div className={classes.scrollable}>
          {filteredCountries.map(country => (
            <React.Fragment key={country.code}>
              <FormControlLabel
                data-test-id="country-row"
                label={country.country}
                checked={country.code === selectedCountry?.code}
                onChange={() => setSelectedCountry(country)}
                control={<Radio />}
              />
              <Divider />
            </React.Fragment>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          data-test-id="add-button"
          variant="primary"
          onClick={() => {
            onConfirm(selectedCountry);
          }}
          disabled={!selectedCountry}
        >
          <FormattedMessage {...buttonMessages.add} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaxCountryDialog;
