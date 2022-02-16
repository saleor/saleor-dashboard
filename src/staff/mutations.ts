import { gql } from "@apollo/client";

export const staffMemberAddMutation = gql`
  mutation StaffMemberAdd($input: StaffCreateInput!) {
    staffCreate(input: $input) {
      errors {
        ...StaffErrorFragment
      }
      user {
        ...StaffMemberDetailsFragment
      }
    }
  }
`;

export const staffMemberUpdateMutation = gql`
  mutation StaffMemberUpdate($id: ID!, $input: StaffUpdateInput!) {
    staffUpdate(id: $id, input: $input) {
      errors {
        ...StaffErrorFragment
      }
      user {
        ...StaffMemberDetailsFragment
      }
    }
  }
`;

export const staffMemberDeleteMutation = gql`
  mutation StaffMemberDelete($id: ID!) {
    staffDelete(id: $id) {
      errors {
        ...StaffErrorFragment
      }
    }
  }
`;

export const staffAvatarUpdateMutation = gql`
  mutation StaffAvatarUpdate($image: Upload!) {
    userAvatarUpdate(image: $image) {
      errors {
        ...AccountErrorFragment
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
        ...AccountErrorFragment
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
        ...AccountErrorFragment
      }
    }
  }
`;
