import { gql } from "@apollo/client";

export const accountErrorFragment = gql`
  fragment SdkAccountError on AccountError {
    code
    field
    message
  }
`;

export const addressFragment = gql`
  fragment SdkAddress on Address {
    id
    firstName
    lastName
    companyName
    streetAddress1
    streetAddress2
    city
    cityArea
    postalCode
    country {
      code
      country
    }
    countryArea
    phone
    isDefaultBillingAddress
    isDefaultShippingAddress
  }
`;

export const userBaseFragment = gql`
  fragment SdkUserBase on User {
    id
    email
    firstName
    lastName
    isStaff
    userPermissions {
      code
      name
    }
  }
`;

export const userDetailsFragment = gql`
  ${addressFragment}
  ${userBaseFragment}

  fragment SdkUserDetails on User {
    ...SdkUserBase
    metadata {
      key
      value
    }
    defaultShippingAddress {
      ...SdkAddress
    }
    defaultBillingAddress {
      ...SdkAddress
    }
    addresses {
      ...SdkAddress
    }
  }
`;
