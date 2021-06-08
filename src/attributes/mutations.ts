import {
  attributeDetailsFragment,
  attributeValueListFragment
} from "@saleor/fragments/attributes";
import { attributeErrorFragment } from "@saleor/fragments/errors";
import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  AttributeBulkDelete,
  AttributeBulkDeleteVariables
} from "./types/AttributeBulkDelete";
import {
  AttributeCreate,
  AttributeCreateVariables
} from "./types/AttributeCreate";
import {
  AttributeDelete,
  AttributeDeleteVariables
} from "./types/AttributeDelete";
import {
  AttributeUpdate,
  AttributeUpdateVariables
} from "./types/AttributeUpdate";
import {
  AttributeValueCreate,
  AttributeValueCreateVariables
} from "./types/AttributeValueCreate";
import {
  AttributeValueDelete,
  AttributeValueDeleteVariables
} from "./types/AttributeValueDelete";
import {
  AttributeValueReorder,
  AttributeValueReorderVariables
} from "./types/AttributeValueReorder";
import {
  AttributeValueUpdate,
  AttributeValueUpdateVariables
} from "./types/AttributeValueUpdate";

const attributeBulkDelete = gql`
  ${attributeErrorFragment}
  mutation AttributeBulkDelete($ids: [ID!]!) {
    attributeBulkDelete(ids: $ids) {
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeBulkDeleteMutation = makeMutation<
  AttributeBulkDelete,
  AttributeBulkDeleteVariables
>(attributeBulkDelete);

const attributeDelete = gql`
  ${attributeErrorFragment}
  mutation AttributeDelete($id: ID!) {
    attributeDelete(id: $id) {
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeDeleteMutation = makeMutation<
  AttributeDelete,
  AttributeDeleteVariables
>(attributeDelete);

export const attributeUpdateMutation = gql`
  ${attributeDetailsFragment}
  ${attributeErrorFragment}
  mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
    attributeUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeUpdateMutation = makeMutation<
  AttributeUpdate,
  AttributeUpdateVariables
>(attributeUpdateMutation);

const attributeValueDelete = gql`
  ${attributeValueListFragment}
  ${attributeErrorFragment}
  mutation AttributeValueDelete(
    $id: ID!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueDelete(id: $id) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeValueDeleteMutation = makeMutation<
  AttributeValueDelete,
  AttributeValueDeleteVariables
>(attributeValueDelete);

export const attributeValueUpdateMutation = gql`
  ${attributeValueListFragment}
  ${attributeErrorFragment}
  mutation AttributeValueUpdate(
    $id: ID!
    $input: AttributeValueCreateInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueUpdate(id: $id, input: $input) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeValueUpdateMutation = makeMutation<
  AttributeValueUpdate,
  AttributeValueUpdateVariables
>(attributeValueUpdateMutation);

export const attributeValueCreateMutation = gql`
  ${attributeValueListFragment}
  ${attributeErrorFragment}
  mutation AttributeValueCreate(
    $id: ID!
    $input: AttributeValueCreateInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeValueCreate(attribute: $id, input: $input) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          ...AttributeValueListFragment
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeValueCreateMutation = makeMutation<
  AttributeValueCreate,
  AttributeValueCreateVariables
>(attributeValueCreateMutation);

export const attributeCreateMutation = gql`
  ${attributeErrorFragment}
  mutation AttributeCreate($input: AttributeCreateInput!) {
    attributeCreate(input: $input) {
      attribute {
        id
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeCreateMutation = makeMutation<
  AttributeCreate,
  AttributeCreateVariables
>(attributeCreateMutation);

const attributeValueReorderMutation = gql`
  ${attributeErrorFragment}
  ${pageInfoFragment}
  mutation AttributeValueReorder(
    $id: ID!
    $move: ReorderInput!
    $firstValues: Int
    $afterValues: String
    $lastValues: Int
    $beforeValues: String
  ) {
    attributeReorderValues(attributeId: $id, moves: [$move]) {
      attribute {
        id
        choices(
          first: $firstValues
          after: $afterValues
          last: $lastValues
          before: $beforeValues
        ) {
          pageInfo {
            ...PageInfoFragment
          }
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
      errors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeValueReorderMutation = makeMutation<
  AttributeValueReorder,
  AttributeValueReorderVariables
>(attributeValueReorderMutation);
