import { gql } from "@apollo/client";

export const requestPasswordReset = gql`
  mutation RequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        ...AccountError
      }
    }
  }
`;
