import { type UseFormGetValues, type UseFormSetValue } from "react-hook-form";

interface FormData {
  countries: string[];
  query: string;
}

export function createCountryChangeHandler(
  getValues: UseFormGetValues<FormData>,
  setValue: UseFormSetValue<FormData>,
) {
  return (countryCode: string, checked: boolean) => {
    const selectedCountries = getValues("countries");
    const updatedCountries = checked
      ? [...selectedCountries, countryCode]
      : selectedCountries.filter(selectedCountry => selectedCountry !== countryCode);

    setValue("countries", updatedCountries);
  };
}

export function createRestOfTheWorldChangeHandler(
  countrySelectionMap: Record<string, boolean>,
  getValues: UseFormGetValues<FormData>,
  restWorldCountries: string[],
  setValue: UseFormSetValue<FormData>,
) {
  return (restOfTheWorld: boolean) => {
    const selectedCountries = getValues("countries");

    if (restOfTheWorld) {
      setValue(
        "countries",
        restWorldCountries
          .filter(countryCode => !countrySelectionMap[countryCode])
          .concat(selectedCountries),
      );
    } else {
      setValue(
        "countries",
        selectedCountries.filter(
          countryCode =>
            !(countrySelectionMap[countryCode] && restWorldCountries.includes(countryCode)),
        ),
      );
    }
  };
}
