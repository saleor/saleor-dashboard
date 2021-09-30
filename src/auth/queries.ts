import { fragmentUser } from "@saleor/fragments/auth";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { UserDetails } from "./types/UserDetails";

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
// export const useUserDetailsQuery = makeQuery<UserDetails, never>(
//   userDetailsQuery
// );
