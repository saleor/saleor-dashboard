import { accountErrorFragment } from "@saleor/fragments/errors";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  RequestPasswordReset,
  RequestPasswordResetVariables
} from "./types/RequestPasswordReset";

export const requestPasswordReset = gql`
  ${accountErrorFragment}
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const RequestPasswordResetMutation = TypedMutation<
  RequestPasswordReset,
  RequestPasswordResetVariables
>(requestPasswordReset);
