import { gql } from "@apollo/client";

export const setRefundReasonType = gql`
  mutation SetRefundReasonType($modelTypeId: ID!) {
    refundSettingsUpdate(input: { refundReasonReferenceType: $modelTypeId }) {
      errors {
        message
        code
      }
    }
  }
`;

export const clearRefundReasonType = gql`
  mutation ClearRefundReasonType {
    refundReasonReferenceClear {
      errors {
        message
        code
      }
    }
  }
`;
