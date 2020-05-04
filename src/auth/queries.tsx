import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import { UserDetails } from "./types/UserDetails";
import { fragmentUser } from "./mutations";

const userDetails = gql`
  ${fragmentUser}
  query UserDetails {
    me {
      ...User
    }
  }
`;
export const UserDetailsQuery = TypedQuery<UserDetails, {}>(userDetails);
