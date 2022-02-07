import { gql } from "@apollo/client";
import { fragmentUser } from "@saleor/fragments/auth";

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

export const userDetailsQuery = gql`
  ${fragmentUser}
  query UserDetails {
    me {
      ...User
    }
  }
`;
