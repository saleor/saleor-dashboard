import { gql } from "@apollo/client";

import { userBaseFragment, userDetailsFragment } from "./fragments";

export const USER_WITHOUT_DETAILS = gql`
  ${userBaseFragment}
  query UserWithoutDetails {
    user: me {
      ...SdkUserBase
    }
    authenticated @client
    authenticating @client
  }
`;

export const USER = gql`
  ${userDetailsFragment}
  query User {
    user: me {
      ...SdkUserDetails
    }
    authenticated @client
    authenticating @client
  }
`;
