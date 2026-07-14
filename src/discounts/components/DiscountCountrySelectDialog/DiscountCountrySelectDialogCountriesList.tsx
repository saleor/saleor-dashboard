import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";

export interface CountryPickerItem {
  id: string;
  name: string;
}

interface DiscountCountrySelectDialogCountriesListProps {
  countries: CountryPickerItem[];
  isCountrySelected: (country: CountryPickerItem) => boolean;
  onChange: (country: CountryPickerItem) => void;
}

export const DiscountCountrySelectDialogCountriesList = ({
  countries,
  isCountrySelected,
  onChange,
}: DiscountCountrySelectDialogCountriesListProps) => {
  return (
    <>
      {countries.map((country, index) => (
        <div
          key={country.id}
          className={listStyles.row}
          data-test-id="country-row"
          data-last-row={index === countries.length - 1 ? true : undefined}
        >
          <ControlledCheckbox
            checked={isCountrySelected(country)}
            name={country.name}
            label={<Text className={listStyles.label}>{country.name}</Text>}
            onChange={() => onChange(country)}
          />
        </div>
      ))}
    </>
  );
};
