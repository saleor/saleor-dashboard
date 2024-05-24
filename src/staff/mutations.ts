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

export const userPassowrdChangeMutation = gql`
  mutation UserPassowrdChange($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      errors {
        ...AccountError
      }
    }
  }
`;

export const userAccountUpdateMutation = gql`
  mutation UserAccountUpdate($input: AccountInput!) {
    accountUpdate(input: $input) {
      user {
        metadata {
          key
          value
        }
      }
      errors {
        ...AccountError
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

export const userAvatarUpdateMutation = gql`
  mutation UserAvatarUpdate($image: Upload!) {
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

export const userAvatarDeleteMutation = gql`
  mutation UserAvatarDelete {
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

export const changeUserPassword = gql`
  mutation ChangeUserPassword($newPassword: String!, $oldPassword: String!) {
    passwordChange(newPassword: $newPassword, oldPassword: $oldPassword) {
      errors {
        ...AccountError
      }
    }
  }
`;
