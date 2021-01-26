import gql from "graphql-tag";

export const availableExternalAuthentications = gql`
  query AvailableExternalAuthentications {
    shop {
      availableExternalAuthentications {
        id
        name
      }
    }
  }
`;
