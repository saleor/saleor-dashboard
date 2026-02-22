import { gql } from "@apollo/client";

export const shopSettingsUpdate = gql`
  mutation ShopSettingsUpdate($shopSettingsInput: ShopSettingsInput!, $addressInput: AddressInput) {
    shopSettingsUpdate(input: $shopSettingsInput) {
      errors {
        ...ShopError
      }
      shop {
        ...Shop
      }
    }
    shopAddressUpdate(input: $addressInput) {
      errors {
        ...ShopError
      }
      shop {
        companyAddress {
          ...Address
        }
      }
    }
  }
`;

export const refundSettingsUpdate = gql`
  mutation RefundSettingsUpdate($refundSettingsInput: RefundSettingsUpdateInput!) {
    refundSettingsUpdate(input: $refundSettingsInput) {
      errors {
        code
        message
      }
      refundSettings {
        reasonReferenceType {
          name
          id
        }
      }
    }
  }
`;

export const refundReasonReferenceClear = gql`
  mutation RefundReasonReferenceClear {
    refundReasonReferenceClear {
      refundSettings {
        reasonReferenceType {
          id
          name
        }
      }
      errors {
        code
        message
      }
    }
  }
`;

export const returnSettingsUpdate = gql`
  mutation ReturnSettingsUpdate($returnSettingsInput: ReturnSettingsUpdateInput!) {
    returnSettingsUpdate(input: $returnSettingsInput) {
      errors {
        code
        message
      }
      returnSettings {
        reasonReferenceType {
          name
          id
        }
      }
    }
  }
`;

export const returnReasonReferenceClear = gql`
  mutation ReturnReasonReferenceClear {
    returnReasonReferenceClear {
      returnSettings {
        reasonReferenceType {
          id
          name
        }
      }
      errors {
        code
        message
      }
    }
  }
`;
