import { gql } from "@apollo/client";

export const refundsSettings = gql`
  query RefundsSettings {
    refundSettings {
      reasonReferenceType {
        id
        name
      }
    }
  }
`;
