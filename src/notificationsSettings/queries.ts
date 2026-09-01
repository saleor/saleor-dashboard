import { gql } from "@apollo/client";

export const staffNotificationRecipients = gql`
  query StaffNotificationRecipients($canManageStaff: Boolean!) {
    shop {
      id
      staffNotificationRecipients {
        id
        email
        active
        user @include(if: $canManageStaff) {
          id
          email
          firstName
          lastName
          isActive
        }
      }
    }
  }
`;
