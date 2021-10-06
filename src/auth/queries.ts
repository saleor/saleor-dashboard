import { fragmentUser } from "@saleor/fragments/auth";
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

export const userDetailsQuery = gql`
  ${fragmentUser}
  query UserDetails {
    me {
      ...User
    }
  }
`;
