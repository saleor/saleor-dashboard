import { gql } from "@apollo/client";

export const countryFragment = gql`
  fragment CountryWithCode on CountryDisplay {
    country
    code
  }
`;

export const languageFragment = gql`
  fragment Language on LanguageDisplay {
    code
    language
  }
`;

export const limitFragment = gql`
  fragment LimitInfo on Limits {
    channels @include(if: $channels)
    orders @include(if: $orders)
    productVariants @include(if: $productVariants)
    staffUsers @include(if: $staffUsers)
    warehouses @include(if: $warehouses)
  }

  fragment ShopLimit on Shop {
    limits {
      currentUsage {
        ...LimitInfo
      }
      allowedUsage {
        ...LimitInfo
      }
    }
  }
`;

export const shopFragment = gql`
  fragment Shop on Shop {
    companyAddress {
      ...Address
    }
    countries {
      code
      country
    }
    customerSetPasswordUrl
    defaultMailSenderAddress
    defaultMailSenderName
    description
    domain {
      host
    }
    name
    reserveStockDurationAnonymousUser
    reserveStockDurationAuthenticatedUser
    limitQuantityPerCheckout
  }
`;
