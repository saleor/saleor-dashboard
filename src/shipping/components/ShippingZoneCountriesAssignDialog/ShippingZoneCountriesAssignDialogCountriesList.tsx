import listStyles from "@dashboard/components/ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { ControlledCheckbox } from "@dashboard/components/ControlledCheckbox";
import { Text } from "@saleor/macaw-ui-next";

export interface ShippingZoneCountryPickerItem {
  id: string;
  name: string;
}

interface ShippingZoneCountriesAssignDialogCountriesListProps {
  countries: ShippingZoneCountryPickerItem[];
  isCountrySelected: (country: ShippingZoneCountryPickerItem) => boolean;
  onChange: (country: ShippingZoneCountryPickerItem) => void;
}

export const ShippingZoneCountriesAssignDialogCountriesList = ({
  countries,
  isCountrySelected,
  onChange,
}: ShippingZoneCountriesAssignDialogCountriesListProps) => {
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
