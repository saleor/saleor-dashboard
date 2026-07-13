// DEV-ONLY-PERMISSION-OVERRIDE: see ./store.ts header for removal instructions.
import { gql } from "@apollo/client";

export const searchPermissionGroupByNameDocument = gql`
  query DevSearchPermissionGroupByName($query: String!) {
    permissionGroups(first: 5, filter: { search: $query }) {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export const searchStaffByEmailDocument = gql`
  query DevSearchStaffByEmail($query: String!) {
    staffUsers(first: 5, filter: { search: $query }) {
      edges {
        node {
          id
          email
        }
      }
    }
  }
`;

export const permissionGroupCreateDocument = gql`
  mutation DevPermissionGroupCreate($input: PermissionGroupCreateInput!) {
    permissionGroupCreate(input: $input) {
      errors {
        code
        field
        message
      }
      group {
        id
        name
      }
    }
  }
`;

export const staffCreateDocument = gql`
  mutation DevStaffCreate($input: StaffCreateInput!) {
    staffCreate(input: $input) {
      errors {
        code
        field
        message
      }
      user {
        id
        email
      }
    }
  }
`;

export const requestPasswordResetDocument = gql`
  mutation DevRequestPasswordReset($email: String!, $redirectUrl: String!) {
    requestPasswordReset(email: $email, redirectUrl: $redirectUrl) {
      errors {
        message
      }
    }
  }
`;
