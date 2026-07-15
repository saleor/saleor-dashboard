import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { FormControlLabel, Radio } from "@material-ui/core";
import { Text } from "@saleor/macaw-ui-next";

export interface TaxCountryPickerItem {
  id: string;
  name: string;
}

interface TaxCountryDialogCountriesListProps {
  countries: TaxCountryPickerItem[];
  selectedCountryId?: string;
  onSelect: (country: TaxCountryPickerItem) => void;
}

export const TaxCountryDialogCountriesList = ({
  countries,
  onSelect,
  selectedCountryId,
}: TaxCountryDialogCountriesListProps): JSX.Element => {
  return (
    <>
      {countries.map((country, index) => (
        <div
          key={country.id}
          className={listStyles.row}
          data-test-id="country-row"
          data-last-row={index === countries.length - 1 ? true : undefined}
        >
          <FormControlLabel
            checked={selectedCountryId === country.id}
            control={<Radio color="primary" name="tax-country-selection" value={country.id} />}
            label={<Text className={listStyles.label}>{country.name}</Text>}
            onChange={() => onSelect(country)}
          />
        </div>
      ))}
    </>
  );
};

TaxCountryDialogCountriesList.displayName = "TaxCountryDialogCountriesList";
