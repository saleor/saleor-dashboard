import { gql } from "@apollo/client";

export const staffNotificationRecipientCreate = gql`
  mutation StaffNotificationRecipientCreate($input: StaffNotificationRecipientInput!) {
    staffNotificationRecipientCreate(input: $input) {
      errors {
        ...ShopError
      }
      staffNotificationRecipient {
        id
        email
        active
      }
    }
  }
`;

export const staffNotificationRecipientDelete = gql`
  mutation StaffNotificationRecipientDelete($id: ID!) {
    staffNotificationRecipientDelete(id: $id) {
      errors {
        ...ShopError
      }
    }
  }
`;
