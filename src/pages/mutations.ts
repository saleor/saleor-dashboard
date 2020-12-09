import {
  pageErrorFragment,
  pageErrorWithAttributesFragment
} from "@saleor/fragments/errors";
import { pageDetailsFragment } from "@saleor/fragments/pages";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import {
  PageBulkPublish,
  PageBulkPublishVariables
} from "./types/PageBulkPublish";
import {
  PageBulkRemove,
  PageBulkRemoveVariables
} from "./types/PageBulkRemove";
import { PageCreate, PageCreateVariables } from "./types/PageCreate";
import { PageRemove, PageRemoveVariables } from "./types/PageRemove";
import { PageUpdate, PageUpdateVariables } from "./types/PageUpdate";

const pageCreate = gql`
  ${pageDetailsFragment}
  ${pageErrorWithAttributesFragment}
  mutation PageCreate($input: PageCreateInput!) {
    pageCreate(input: $input) {
      errors: pageErrors {
        ...PageErrorWithAttributesFragment
        message
      }
      page {
        ...PageDetailsFragment
      }
    }
  }
`;
export const TypedPageCreate = TypedMutation<PageCreate, PageCreateVariables>(
  pageCreate
);

const pageUpdate = gql`
  ${pageDetailsFragment}
  ${pageErrorWithAttributesFragment}
  mutation PageUpdate($id: ID!, $input: PageInput!) {
    pageUpdate(id: $id, input: $input) {
      errors: pageErrors {
        ...PageErrorWithAttributesFragment
      }
      page {
        ...PageDetailsFragment
      }
    }
  }
`;
export const usePageUpdateMutation = makeMutation<
  PageUpdate,
  PageUpdateVariables
>(pageUpdate);

const pageRemove = gql`
  ${pageErrorFragment}
  mutation PageRemove($id: ID!) {
    pageDelete(id: $id) {
      errors: pageErrors {
        ...PageErrorFragment
      }
    }
  }
`;
export const usePageRemoveMutation = makeMutation<
  PageRemove,
  PageRemoveVariables
>(pageRemove);

const pageBulkPublish = gql`
  mutation PageBulkPublish($ids: [ID]!, $isPublished: Boolean!) {
    pageBulkPublish(ids: $ids, isPublished: $isPublished) {
      errors {
        field
        message
      }
    }
  }
`;
export const TypedPageBulkPublish = TypedMutation<
  PageBulkPublish,
  PageBulkPublishVariables
>(pageBulkPublish);

const pageBulkRemove = gql`
  mutation PageBulkRemove($ids: [ID]!) {
    pageBulkDelete(ids: $ids) {
      errors {
        field
        message
      }
    }
  }
`;
export const TypedPageBulkRemove = TypedMutation<
  PageBulkRemove,
  PageBulkRemoveVariables
>(pageBulkRemove);
