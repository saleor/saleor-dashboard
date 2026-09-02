import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { Radio } from "@dashboard/components/Radio/Radio";
import { Text } from "@saleor/macaw-ui-next";

interface TaxCountryPickerItem {
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
          <Radio
            checked={selectedCountryId === country.id}
            value={country.id}
            onChange={() => onSelect(country)}
          >
            <Text className={listStyles.label}>{country.name}</Text>
          </Radio>
        </div>
      ))}
    </>
  );
};

TaxCountryDialogCountriesList.displayName = "TaxCountryDialogCountriesList";
