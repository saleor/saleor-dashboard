import { gql } from "@apollo/client";

export const shopStagingFragment = gql`
  fragment ShopStaging on Shop {
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
    enableAccountConfirmationByEmail
    useLegacyUpdateWebhookEmission
    preserveAllAddressFields
    passwordLoginMode
  }
`;
