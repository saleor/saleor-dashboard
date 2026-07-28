import { gql } from "@apollo/client";

export const refundSettings = gql`
  query RefundSettings {
    refundSettings {
      reasonReferenceType {
        id
        name
      }
    }
  }
`;

export const returnSettings = gql`
  query ReturnSettings {
    returnSettings {
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
