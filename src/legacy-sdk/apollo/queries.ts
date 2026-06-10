import { gql } from "@apollo/client";

import { userBaseFragment, userDetailsFragment } from "./fragments";

export const USER_WITHOUT_DETAILS = gql`
  ${userBaseFragment}
  query UserWithoutDetails {
    user: me {
      ...UserBaseFragment
    }
    authenticated @client
    authenticating @client
  }
`;

export const USER = gql`
  ${userDetailsFragment}
  query User {
    user: me {
      ...UserDetailsFragment
    }
    authenticated @client
    authenticating @client
  }
`;
