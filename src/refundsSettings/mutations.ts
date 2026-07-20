import { gql } from "@apollo/client";

export const refundSettingsUpdate = gql`
  mutation RefundSettingsUpdate($refundSettingsInput: RefundSettingsUpdateInput!) {
    refundSettingsUpdate(input: $refundSettingsInput) {
      errors {
        code
        message
      }
    }
  }
`;

export const refundReasonReferenceClear = gql`
  mutation RefundReasonReferenceClear {
    refundReasonReferenceClear {
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
    }
  }
`;

export const returnReasonReferenceClear = gql`
  mutation ReturnReasonReferenceClear {
    returnReasonReferenceClear {
      errors {
        code
        message
      }
    }
  }
`;
