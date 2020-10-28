import { pageErrorFragment } from "@saleor/fragments/errors";
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
