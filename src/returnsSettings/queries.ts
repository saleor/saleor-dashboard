import { gql } from "@apollo/client";

export const returnsSettings = gql`
  query ReturnsSettings {
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
