import { gql } from "@apollo/client";

export const staffMemberAddMutation = gql`
  mutation StaffMemberAdd($input: StaffCreateInput!) {
    staffCreate(input: $input) {
      errors {
        ...StaffError
      }
      user {
        ...StaffMemberDetails
      }
    }
  }
`;

export const staffMemberUpdateMutation = gql`
  mutation StaffMemberUpdate($id: ID!, $input: StaffUpdateInput!) {
    staffUpdate(id: $id, input: $input) {
      errors {
        ...StaffError
      }
      user {
        ...StaffMemberDetails
      }
    }
  }
`;

export const staffMemberDeleteMutation = gql`
  mutation StaffMemberDelete($id: ID!) {
    staffDelete(id: $id) {
      errors {
        ...StaffError
      }
    }
  }
`;

export const staffAvatarUpdateMutation = gql`
  mutation StaffAvatarUpdate($image: Upload!) {
    userAvatarUpdate(image: $image) {
      errors {
        ...AccountError
      }
      user {
        id
        avatar {
          url
        }
      }
    }
  }
`;

export const staffAvatarDeleteMutation = gql`
  mutation StaffAvatarDelete {
    userAvatarDelete {
      errors {
        ...AccountError
      }
      user {
        id
        avatar {
          url
        }
      }
    }
  }
`;

export const changeStaffPassword = gql`
  mutation ChangeStaffPassword($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      errors {
        ...AccountError
      }
    }
  }
`;
