import { attributeDetailsFragment } from "@saleor/fragments/attributes";
import { attributeErrorFragment } from "@saleor/fragments/errors";
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
      errors: attributeErrors {
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
      errors: attributeErrors {
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
      errors: attributeErrors {
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
  ${attributeDetailsFragment}
  ${attributeErrorFragment}
  mutation AttributeValueDelete($id: ID!) {
    attributeValueDelete(id: $id) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: attributeErrors {
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
  ${attributeDetailsFragment}
  ${attributeErrorFragment}
  mutation AttributeValueUpdate($id: ID!, $input: AttributeValueCreateInput!) {
    attributeValueUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: attributeErrors {
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
  ${attributeDetailsFragment}
  ${attributeErrorFragment}
  mutation AttributeValueCreate($id: ID!, $input: AttributeValueCreateInput!) {
    attributeValueCreate(attribute: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: attributeErrors {
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
  ${attributeDetailsFragment}
  ${attributeErrorFragment}
  mutation AttributeCreate($input: AttributeCreateInput!) {
    attributeCreate(input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: attributeErrors {
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
  mutation AttributeValueReorder($id: ID!, $move: ReorderInput!) {
    attributeReorderValues(attributeId: $id, moves: [$move]) {
      attribute {
        id
        values {
          id
        }
      }
      errors: attributeErrors {
        ...AttributeErrorFragment
      }
    }
  }
`;
export const useAttributeValueReorderMutation = makeMutation<
  AttributeValueReorder,
  AttributeValueReorderVariables
>(attributeValueReorderMutation);
