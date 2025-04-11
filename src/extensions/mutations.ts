import { gql } from "@apollo/client";

export const appDeleteFailedInstallationMutation = gql`
  mutation AppDeleteFailedInstallation($id: ID!) {
    appDeleteFailedInstallation(id: $id) {
      appInstallation {
        id
        status
        appName
        message
      }
      errors {
        ...AppError
      }
    }
  }
`;
