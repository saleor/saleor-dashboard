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

export const modelTypes = gql`
  query ModelTypes {
    pageTypes(first: 100, sortBy: { field: NAME, direction: ASC }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;
