import gql from "graphql-tag";

import makeMutation from "@saleor/hooks/makeMutation";
import {
  WarehouseCreate,
  WarehouseCreateVariables
} from "./types/WarehouseCreate";
import {
  WarehouseUpdate,
  WarehouseUpdateVariables
} from "./types/WarehouseUpdate";
import {
  WarehouseDelete,
  WarehouseDeleteVariables
} from "./types/WarehouseDelete";
import { warehouseDetailsFragment } from "./queries";

export const warehouseErrorFragment = gql`
  fragment WarehouseErrorFragment on WarehouseError {
    code
    field
  }
`;

const deleteWarehouse = gql`
  ${warehouseErrorFragment}
  mutation WarehouseDelete($id: ID!) {
    deleteWarehouse(id: $id) {
      errors: warehouseErrors {
        ...WarehouseErrorFragment
      }
    }
  }
`;
export const useWarehouseDelete = makeMutation<
  WarehouseDelete,
  WarehouseDeleteVariables
>(deleteWarehouse);

const createWarehouse = gql`
  ${warehouseDetailsFragment}
  ${warehouseErrorFragment}
  mutation WarehouseCreate($input: WarehouseCreateInput!) {
    createWarehouse(input: $input) {
      errors: warehouseErrors {
        ...WarehouseErrorFragment
      }
      warehouse {
        ...WarehouseDetailsFragment
      }
    }
  }
`;
export const useWarehouseCreate = makeMutation<
  WarehouseCreate,
  WarehouseCreateVariables
>(createWarehouse);

const updateWarehouse = gql`
  ${warehouseDetailsFragment}
  ${warehouseErrorFragment}
  mutation WarehouseUpdate($id: ID!, $input: WarehouseUpdateInput!) {
    updateWarehouse(id: $id, input: $input) {
      errors: warehouseErrors {
        ...WarehouseErrorFragment
      }
      warehouse {
        ...WarehouseDetailsFragment
      }
    }
  }
`;
export const useWarehouseUpdate = makeMutation<
  WarehouseUpdate,
  WarehouseUpdateVariables
>(updateWarehouse);
