import { gql } from "@apollo/client";

export const setReturnReasonType = gql`
  mutation SetReturnReasonType($modelTypeId: ID!) {
    returnSettingsUpdate(input: { returnReasonReferenceType: $modelTypeId }) {
      returnSettings {
        reasonReferenceType {
          id
          name
        }
      }
      errors {
        message
        code
      }
    }
  }
`;

export const clearReturnReasonType = gql`
  mutation ClearReturnReasonType {
    returnReasonReferenceClear {
      errors {
        message
        code
      }
      returnSettings {
        reasonReferenceType {
          id
          name
        }
      }
    }
  }
`;
