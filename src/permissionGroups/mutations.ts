import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";

import { permissionGroupDetailsFragment } from "./queries";
import {
  PermissionGroupCreate,
  PermissionGroupCreateVariables
} from "./types/PermissionGroupCreate";
import {
  PermissionGroupDelete,
  PermissionGroupDeleteVariables
} from "./types/PermissionGroupDelete";
import {
  PermissionGroupUpdate,
  PermissionGroupUpdateVariables
} from "./types/PermissionGroupUpdate";

export const permissionGroupErrorFragment = gql`
  fragment PermissionGroupErrorFragment on PermissionGroupError {
    code
    field
  }
`;

export const permissionGroupDelete = gql`
  ${permissionGroupErrorFragment}
  mutation PermissionGroupDelete($id: ID!) {
    permissionGroupDelete(id: $id) {
      errors: permissionGroupErrors {
        ...PermissionGroupErrorFragment
      }
    }
  }
`;
export const usePermissionGroupDelete = makeMutation<
  PermissionGroupDelete,
  PermissionGroupDeleteVariables
>(permissionGroupDelete);

export const permissionGroupCreate = gql`
  ${permissionGroupDetailsFragment}
  ${permissionGroupErrorFragment}

  mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
    permissionGroupCreate(input: $input) {
      errors: permissionGroupErrors {
        ...PermissionGroupErrorFragment
      }
      group {
        ...PermissionGroupDetailsFragment
      }
    }
  }
`;

export const usePermissionGroupCreate = makeMutation<
  PermissionGroupCreate,
  PermissionGroupCreateVariables
>(permissionGroupCreate);

export const permissionGroupUpdate = gql`
  ${permissionGroupDetailsFragment}
  ${permissionGroupErrorFragment}

  mutation PermissionGroupUpdate(
    $id: ID!
    $input: PermissionGroupUpdateInput!
  ) {
    permissionGroupUpdate(id: $id, input: $input) {
      errors: permissionGroupErrors {
        ...PermissionGroupErrorFragment
      }
      group {
        ...PermissionGroupDetailsFragment
      }
    }
  }
`;

export const usePermissionGroupUpdate = makeMutation<
  PermissionGroupUpdate,
  PermissionGroupUpdateVariables
>(permissionGroupUpdate);
