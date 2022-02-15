import { gql } from "@apollo/client";

export const pageTypeUpdateMutation = gql`
  mutation PageTypeUpdate($id: ID!, $input: PageTypeUpdateInput!) {
    pageTypeUpdate(id: $id, input: $input) {
      errors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;

export const pageTypeCreateMutation = gql`
  mutation PageTypeCreate($input: PageTypeCreateInput!) {
    pageTypeCreate(input: $input) {
      errors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;

export const assignPageAttributeMutation = gql`
  mutation AssignPageAttribute($id: ID!, $ids: [ID!]!) {
    pageAttributeAssign(pageTypeId: $id, attributeIds: $ids) {
      errors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;

export const unassignPageAttributeMutation = gql`
  mutation UnassignPageAttribute($id: ID!, $ids: [ID!]!) {
    pageAttributeUnassign(pageTypeId: $id, attributeIds: $ids) {
      errors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;

export const pageTypeDeleteMutation = gql`
  mutation PageTypeDelete($id: ID!) {
    pageTypeDelete(id: $id) {
      errors {
        ...PageTypeDeleteErrorFragment
      }
      pageType {
        id
      }
    }
  }
`;

export const pageTypeBulkDeleteMutation = gql`
  mutation PageTypeBulkDelete($ids: [ID!]!) {
    pageTypeBulkDelete(ids: $ids) {
      errors {
        ...PageTypeDeleteErrorFragment
      }
    }
  }
`;

export const pageTypeAttributeReorder = gql`
  mutation PageTypeAttributeReorder($move: ReorderInput!, $pageTypeId: ID!) {
    pageTypeReorderAttributes(moves: [$move], pageTypeId: $pageTypeId) {
      errors {
        ...PageErrorFragment
      }
      pageType {
        ...PageTypeDetailsFragment
      }
    }
  }
`;
