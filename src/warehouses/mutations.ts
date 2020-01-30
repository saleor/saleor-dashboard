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

const deleteWarehouse = gql`
  mutation WarehouseDelete($id: ID!) {
    deleteWarehouse(id: $id) {
      errors {
        field
        message
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
  mutation WarehouseCreate($input: WarehouseCreateInput!) {
    createWarehouse(input: $input) {
      errors {
        field
        message
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
  mutation WarehouseUpdate($id: ID!, $input: WarehouseUpdateInput!) {
    updateWarehouse(id: $id, input: $input) {
      errors {
        field
        message
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
