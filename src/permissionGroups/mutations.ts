import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";
import {
  PermissionGroupDeleteVariables,
  PermissionGroupDelete
} from "./types/PermissionGroupDelete";

const permissionGroupDelete = gql`
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
