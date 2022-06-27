import {
  Dialog,
  DialogActions,
  DialogContent,
  InputAdornment,
  TextField
} from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import { CountryFragment } from "@saleor/graphql";
import { ChangeEvent } from "@saleor/hooks/useForm";
import { useLocalSearch } from "@saleor/hooks/useLocalSearch";
import useModalDialogOpen from "@saleor/hooks/useModalDialogOpen";
import { buttonMessages } from "@saleor/intl";
import { Button, DialogHeader, SearchIcon } from "@saleor/macaw-ui";
import { taxesMessages } from "@saleor/taxes/messages";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";
import { TaxCountryDialogLine } from "./TaxCountryDialogLine";

export interface CountryFragmentWithState extends CountryFragment {
  checked: boolean;
}
interface TaxCountryDialogProps {
  open: boolean;
  countries: CountryFragmentWithState[];
  onConfirm: (countries: CountryFragment[]) => void;
  onClose: () => void;
}

export const TaxCountryDialog: React.FC<TaxCountryDialogProps> = ({
  open,
  countries,
  onConfirm,
  onClose
}) => {
  const classes = useStyles();
  const intl = useIntl();

  const [countriesWithState, setCountriesWithState] = React.useState<
    CountryFragmentWithState[]
  >([]);
  React.useEffect(() => setCountriesWithState(countries), [countries, open]);

  const handleChange = React.useCallback(
    (e: ChangeEvent) => {
      setCountriesWithState(prevCountries =>
        prevCountries.map(country =>
          country.code === e.target.name
            ? {
                ...country,
                checked: e.target.value
              }
            : country
        )
      );
    },
    [countries, setCountriesWithState]
  );

  useModalDialogOpen(open, {
    onClose: () => {
      setCountriesWithState([]);
      setQuery("");
    }
  });

  const { query, setQuery, searchResult: filteredCountries } = useLocalSearch<
    CountryFragmentWithState
  >(countriesWithState, country => country.country);

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <DialogHeader onClose={onClose}>
        <FormattedMessage {...taxesMessages.chooseCountries} />
      </DialogHeader>
      <DialogContent className={classes.wrapper}>
        <TextField
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
            )
          }}
          inputProps={{ className: classes.inputPadding }}
        />
        <VerticalSpacer spacing={2} />
        <div className={classes.scrollable}>
          {filteredCountries.map(country => (
            <TaxCountryDialogLine
              key={country.code}
              country={country}
              checked={country.checked}
              handleChange={handleChange}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          variant="primary"
          onClick={() => {
            onConfirm(countriesWithState.filter(country => country.checked));
          }}
        >
          <FormattedMessage {...buttonMessages.select} />
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaxCountryDialog;
