// @ts-strict-ignore
import { DASHBOARD_MODAL_WIDTH, DashboardModal } from "@dashboard/components/Modal";
import { CountryFragment } from "@dashboard/graphql";
import { useLocalSearch } from "@dashboard/hooks/useLocalSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { taxesMessages } from "@dashboard/taxes/messages";
import { Divider, FormControlLabel, InputAdornment, Radio, TextField } from "@material-ui/core";
import { SearchIcon } from "@saleor/macaw-ui";
import { Box, Button } from "@saleor/macaw-ui-next";
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
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content __width={DASHBOARD_MODAL_WIDTH}>
        <DashboardModal.Title display="flex" justifyContent="space-between" alignItems="center">
          <FormattedMessage {...taxesMessages.chooseCountryDialogTitle} />
          <DashboardModal.Close onClose={onClose} />
        </DashboardModal.Title>

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

        <Box
          display="flex"
          flexDirection="column"
          overflowY="scroll"
          __maxHeight="60vh"
          __marginLeft={-15}
          __paddingLeft={15}
        >
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
        </Box>

        <DashboardModal.Actions>
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
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default TaxCountryDialog;
