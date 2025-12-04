// @ts-strict-ignore
import { AddressTypeInput } from "@dashboard/customers/types";
import { AccountErrorFragment, OrderErrorFragment } from "@dashboard/graphql";
import { commonMessages } from "@dashboard/intl";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Input, Option } from "@saleor/macaw-ui-next";
import * as React from "react";
import { useIntl } from "react-intl";

import { Combobox } from "../Combobox";
import { getErrorMessage } from "./getErrorMessage";
import { useAddressValidation } from "./useAddressValidation";

interface AddressEditProps {
  countries: Option[];
  countryDisplayValue: string;
  data: AddressTypeInput;
  disabled?: boolean;
  errors: Array<AccountErrorFragment | OrderErrorFragment>;
  onChange: (event: React.ChangeEvent<any>) => any;
  onCountryChange: (event: React.ChangeEvent<any>) => any;
}

const PossibleFormFields = {
  CITY: "city",
  CITY_AREA: "cityArea",
  COUNTRY: "country",
  COUNTRY_AREA: "countryArea",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
  COMPANY_NAME: "companyName",
  PHONE: "phone",
  POSTAL_CODE: "postalCode",
  STREET_ADDRESS_1: "streetAddress1",
  STREET_ADDRESS_2: "streetAddress2",
} as const;
const formFields: Array<keyof AddressTypeInput> = Object.values(PossibleFormFields);

export const AddressEdit = (props: AddressEditProps) => {
  const { countries, countryDisplayValue, data, disabled, errors, onChange, onCountryChange } =
    props;
  const intl = useIntl();
  const { areas, isFieldAllowed, getDisplayValue } = useAddressValidation(data.country);
  const formErrors = getFormErrors<
    keyof AddressTypeInput,
    AccountErrorFragment | OrderErrorFragment
  >(formFields, errors);

  return (
    <>
      <Box display="grid" gap={2} __gridTemplateColumns="1fr 1fr">
        <div>
          <Input
            disabled={disabled}
            data-test-id="first-name-input"
            error={!!formErrors.firstName}
            helperText={getErrorMessage(formErrors.firstName, intl)}
            label={intl.formatMessage(commonMessages.firstName)}
            name="firstName"
            onChange={onChange}
            value={data.firstName}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
        <div>
          <Input
            disabled={disabled}
            data-test-id="last-name-input"
            error={!!formErrors.lastName}
            helperText={getErrorMessage(formErrors.lastName, intl)}
            label={intl.formatMessage(commonMessages.lastName)}
            name="lastName"
            onChange={onChange}
            value={data.lastName}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
      </Box>
      <Box display="grid" gap={2} __gridTemplateColumns="1fr 1fr">
        <div>
          <Input
            data-test-id="company-name-input"
            disabled={disabled}
            error={!!formErrors.companyName}
            helperText={getErrorMessage(formErrors.companyName, intl)}
            label={intl.formatMessage({
              id: "9YazHG",
              defaultMessage: "Company",
            })}
            name="companyName"
            onChange={onChange}
            value={data.companyName}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
        <div>
          <Input
            disabled={disabled}
            data-test-id="phone-input"
            error={!!formErrors.phone}
            helperText={getErrorMessage(formErrors.phone, intl)}
            label={intl.formatMessage({
              id: "O95R3Z",
              defaultMessage: "Phone",
            })}
            name="phone"
            value={data.phone}
            onChange={onChange}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
      </Box>
      <Input
        disabled={disabled}
        data-test-id="address-line-1-input"
        error={!!formErrors.streetAddress1}
        helperText={getErrorMessage(formErrors.streetAddress1, intl)}
        label={intl.formatMessage({
          id: "B52Em/",
          defaultMessage: "Address line 1",
        })}
        name="streetAddress1"
        onChange={onChange}
        value={data.streetAddress1}
        width="100%"
        spellCheck={false}
        autoComplete="new-password"
      />
      <Input
        disabled={disabled}
        data-test-id="address-line-2-input"
        error={!!formErrors.streetAddress2}
        helperText={getErrorMessage(formErrors.streetAddress2, intl)}
        label={intl.formatMessage({
          id: "oQY0a2",
          defaultMessage: "Address line 2",
        })}
        name="streetAddress2"
        onChange={onChange}
        value={data.streetAddress2}
        width="100%"
        spellCheck={false}
        autoComplete="new-password"
      />
      <Box display="grid" gap={2} __gridTemplateColumns="1fr 1fr">
        <div>
          <Input
            disabled={disabled}
            data-test-id="city-input"
            error={!!formErrors.city}
            helperText={getErrorMessage(formErrors.city, intl)}
            label={intl.formatMessage({
              id: "TE4fIS",
              defaultMessage: "City",
            })}
            name="city"
            onChange={onChange}
            value={data.city}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
        <div>
          <Input
            disabled={disabled}
            data-test-id="zip-input"
            error={!!formErrors.postalCode}
            label={intl.formatMessage({
              id: "oYGfnY",
              defaultMessage: "ZIP / Postal code",
            })}
            name="postalCode"
            onChange={onChange}
            value={data.postalCode}
            width="100%"
            spellCheck={false}
            autoComplete="new-password"
          />
        </div>
      </Box>

      <Box display="grid" gap={2} __gridTemplateColumns="1fr 1fr">
        <div>
          <Combobox
            data-test-id="address-edit-country-select-field"
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            error={!!formErrors.country}
            helperText={getErrorMessage(formErrors.country, intl)}
            label={intl.formatMessage({
              id: "vONi+O",
              defaultMessage: "Country",
            })}
            options={countries}
            fetchOptions={() => undefined}
            name="country"
            value={{
              label: countryDisplayValue,
              value: data.country,
            }}
            onChange={onCountryChange}
          />
        </div>
        <div>
          {isFieldAllowed(PossibleFormFields.COUNTRY_AREA) && (
            <Combobox
              data-test-id="address-edit-country-area-field"
              autoComplete="off"
              spellCheck={false}
              disabled={disabled}
              error={!!formErrors.countryArea}
              helperText={getErrorMessage(formErrors.countryArea, intl)}
              label={intl.formatMessage({
                id: "AuwpCm",
                defaultMessage: "Country area",
              })}
              options={areas}
              fetchOptions={() => undefined}
              name="countryArea"
              value={{
                label: getDisplayValue(data.countryArea),
                value: data.countryArea,
              }}
              onChange={onChange}
            />
          )}
        </div>
      </Box>
    </>
  );
};
