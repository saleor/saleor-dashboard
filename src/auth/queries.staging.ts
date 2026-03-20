import { gql } from "@apollo/client";

export const availableExternalAuthenticationsStaging = gql`
  query AvailableExternalAuthenticationsStaging {
    shop {
      availableExternalAuthentications {
        id
        name
      }
      passwordLoginMode
    }
  }
`;
