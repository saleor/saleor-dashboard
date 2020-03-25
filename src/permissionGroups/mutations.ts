import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";
import {
  PermissionGroupDeleteVariables,
  PermissionGroupDelete
} from "./types/PermissionGroupDelete";
import {
  PermissionGroupCreate,
  PermissionGroupCreateVariables
} from "./types/PermissionGroupCreate";
import { permissionGroupDetailsFragment } from "./queries";
import {
  PermissionGroupUpdate,
  PermissionGroupUpdateVariables
} from "./types/PermissionGroupUpdate";

export const permissionGroupDelete = gql`
  mutation PermissionGroupDelete($id: ID!) {
    permissionGroupDelete(id: $id) {
      errors {
        field
        message
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
  mutation PermissionGroupCreate($input: PermissionGroupCreateInput!) {
    permissionGroupCreate(input: $input) {
      errors {
        field
        message
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
  mutation PermissionGroupUpdate(
    $id: ID!
    $input: PermissionGroupUpdateInput!
  ) {
    permissionGroupUpdate(id: $id, input: $input) {
      errors {
        field
        message
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
