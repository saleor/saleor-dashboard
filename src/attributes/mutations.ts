import { attributeDetailsFragment } from "@saleor/fragments/attributes";
import { productErrorFragment } from "@saleor/fragments/errors";
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
  ${productErrorFragment}
  mutation AttributeBulkDelete($ids: [ID!]!) {
    attributeBulkDelete(ids: $ids) {
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useAttributeBulkDeleteMutation = makeMutation<
  AttributeBulkDelete,
  AttributeBulkDeleteVariables
>(attributeBulkDelete);

const attributeDelete = gql`
  ${productErrorFragment}
  mutation AttributeDelete($id: ID!) {
    attributeDelete(id: $id) {
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation AttributeUpdate($id: ID!, $input: AttributeUpdateInput!) {
    attributeUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation AttributeValueDelete($id: ID!) {
    attributeValueDelete(id: $id) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation AttributeValueUpdate($id: ID!, $input: AttributeValueCreateInput!) {
    attributeValueUpdate(id: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation AttributeValueCreate($id: ID!, $input: AttributeValueCreateInput!) {
    attributeValueCreate(attribute: $id, input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
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
  ${productErrorFragment}
  mutation AttributeCreate($input: AttributeCreateInput!) {
    attributeCreate(input: $input) {
      attribute {
        ...AttributeDetailsFragment
      }
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useAttributeCreateMutation = makeMutation<
  AttributeCreate,
  AttributeCreateVariables
>(attributeCreateMutation);

const attributeValueReorderMutation = gql`
  ${productErrorFragment}
  mutation AttributeValueReorder($id: ID!, $move: ReorderInput!) {
    attributeReorderValues(attributeId: $id, moves: [$move]) {
      attribute {
        id
        values {
          id
        }
      }
      errors: productErrors {
        ...ProductErrorFragment
      }
    }
  }
`;
export const useAttributeValueReorderMutation = makeMutation<
  AttributeValueReorder,
  AttributeValueReorderVariables
>(attributeValueReorderMutation);
