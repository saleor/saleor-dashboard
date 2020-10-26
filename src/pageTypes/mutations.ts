import { pageErrorFragment } from "@saleor/fragments/errors";
import { pageTypeDetailsFragment } from "@saleor/fragments/pageTypes";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  AssignPageAttribute,
  AssignPageAttributeVariables
} from "./types/AssignPageAttribute";
import {
  PageTypeCreate,
  PageTypeCreateVariables
} from "./types/PageTypeCreate";
import {
  PageTypeUpdate,
  PageTypeUpdateVariables
} from "./types/PageTypeUpdate";
import {
  UnassignPageAttribute,
  UnassignPageAttributeVariables
} from "./types/UnassignPageAttribute";

export const pageTypeUpdateMutation = gql`
  ${pageTypeDetailsFragment}
  ${pageErrorFragment}
  mutation PageTypeUpdate($id: ID!, $input: PageTypeUpdateInput!) {
    pageTypeUpdate(id: $id, input: $input) {
      errors: pageErrors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;
export const usePageTypeUpdateMutation = makeMutation<
  PageTypeUpdate,
  PageTypeUpdateVariables
>(pageTypeUpdateMutation);

export const pageTypeCreateMutation = gql`
  ${pageTypeDetailsFragment}
  ${pageErrorFragment}
  mutation PageTypeCreate($input: PageTypeCreateInput!) {
    pageTypeCreate(input: $input) {
      errors: pageErrors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;
export const usePageTypeCreateMutation = makeMutation<
  PageTypeCreate,
  PageTypeCreateVariables
>(pageTypeCreateMutation);

export const assignPageAttributeMutation = gql`
  ${pageTypeDetailsFragment}
  ${pageErrorFragment}
  mutation AssignPageAttribute($id: ID!, $ids: [ID!]!) {
    pageAttributeAssign(pageTypeId: $id, attributeIds: $ids) {
      errors: pageErrors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;
export const useAssignPageAttributeMutation = makeMutation<
  AssignPageAttribute,
  AssignPageAttributeVariables
>(assignPageAttributeMutation);

export const unassignPageAttributeMutation = gql`
  ${pageTypeDetailsFragment}
  ${pageErrorFragment}
  mutation UnassignPageAttribute($id: ID!, $ids: [ID!]!) {
    pageAttributeUnassign(pageTypeId: $id, attributeIds: $ids) {
      errors: pageErrors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;
export const useUnassignPageAttributeMutation = makeMutation<
  UnassignPageAttribute,
  UnassignPageAttributeVariables
>(unassignPageAttributeMutation);
