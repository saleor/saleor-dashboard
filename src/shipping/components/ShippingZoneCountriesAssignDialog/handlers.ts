import { FormChange } from "@saleor/hooks/useForm";

export function createCountryChangeHandler(
  selectedCountries: string[],
  change: FormChange,
) {
  return (countryCode: string, checked: boolean) => {
    const updatedCountries = checked
      ? [...selectedCountries, countryCode]
      : selectedCountries.filter(
          selectedCountry => selectedCountry !== countryCode,
        );
    change({
      target: {
        name: "countries" as keyof FormData,
        value: updatedCountries,
      },
    } as any);
  };
}

export function createRestOfTheWorldChangeHandler(
  countrySelectionMap: Map<string, boolean>,
  selectedCountries: string[],
  restWorldCountries: string[],
  change: FormChange,
) {
  return (restOfTheWorld: boolean) => {
    if (restOfTheWorld) {
      change({
        target: {
          name: "countries" as keyof FormData,
          value: restWorldCountries
            .filter(countryCode => !countrySelectionMap[countryCode])
            .concat(selectedCountries),
        },
      } as any);
    } else {
      change({
        target: {
          name: "countries" as keyof FormData,
          value: selectedCountries.filter(
            countryCode =>
              !(
                countrySelectionMap[countryCode] &&
                restWorldCountries.includes(countryCode)
              ),
          ),
        },
      } as any);
    }
  };
}
