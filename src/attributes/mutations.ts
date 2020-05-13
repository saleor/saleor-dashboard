import { TypedMutation } from "@saleor/mutations";
import gql from "graphql-tag";

import { attributeDetailsFragment } from "./queries";
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

export const productErrorFragment = gql`
  fragment ProductErrorFragment on ProductError {
    code
    field
  }
`;

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
export const AttributeBulkDeleteMutation = TypedMutation<
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
export const AttributeDeleteMutation = TypedMutation<
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
export const AttributeUpdateMutation = TypedMutation<
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
export const AttributeValueDeleteMutation = TypedMutation<
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
export const AttributeValueUpdateMutation = TypedMutation<
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
export const AttributeValueCreateMutation = TypedMutation<
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
export const AttributeCreateMutation = TypedMutation<
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
export const AttributeValueReorderMutation = TypedMutation<
  AttributeValueReorder,
  AttributeValueReorderVariables
>(attributeValueReorderMutation);
