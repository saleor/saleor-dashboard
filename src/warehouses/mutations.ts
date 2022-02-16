import { gql } from "@apollo/client";

export const deleteWarehouse = gql`
  mutation WarehouseDelete($id: ID!) {
    deleteWarehouse(id: $id) {
      errors {
        ...WarehouseErrorFragment
      }
    }
  }
`;

export const createWarehouse = gql`
  mutation WarehouseCreate($input: WarehouseCreateInput!) {
    createWarehouse(input: $input) {
      errors {
        ...WarehouseErrorFragment
      }
      warehouse {
        ...WarehouseDetailsFragment
      }
    }
  }
`;

export const updateWarehouse = gql`
  mutation WarehouseUpdate($id: ID!, $input: WarehouseUpdateInput!) {
    updateWarehouse(id: $id, input: $input) {
      errors {
        ...WarehouseErrorFragment
      }
      warehouse {
        ...WarehouseDetailsFragment
      }
    }
  }
`;
