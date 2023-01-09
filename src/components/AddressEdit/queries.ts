import { gql } from "@apollo/client";

export const addressValidationQuery = gql`
  query addressValidationRules($countryCode: CountryCode!) {
    addressValidationRules(countryCode: $countryCode) {
      countryAreaChoices {
        raw
        verbose
      }
      allowedFields
    }
  }
`;
