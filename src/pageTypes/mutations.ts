import { pageTypeDetailsFragment } from "@saleor/fragments/pageTypes";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import {
  PageTypeCreate,
  PageTypeCreateVariables
} from "./types/PageTypeCreate";
import {
  PageTypeUpdate,
  PageTypeUpdateVariables
} from "./types/PageTypeUpdate";

export const pageTypeUpdateMutation = gql`
  ${pageTypeDetailsFragment}
  mutation PageTypeUpdate($id: ID!, $input: PageTypeUpdateInput!) {
    pageTypeUpdate(id: $id, input: $input) {
      errors: pageErrors {
        field
        message
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
  mutation PageTypeCreate($input: PageTypeCreateInput!) {
    pageTypeCreate(input: $input) {
      errors: pageErrors {
        field
        message
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
