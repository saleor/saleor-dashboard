import { attributeFragment } from "@saleor/attributes/queries";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { pageInfoFragment, TypedQuery } from "../queries";
import { ProductTypeCreateData } from "./types/ProductTypeCreateData";
import {
  ProductTypeDetails,
  ProductTypeDetailsVariables
} from "./types/ProductTypeDetails";
import {
  ProductTypeList,
  ProductTypeListVariables
} from "./types/ProductTypeList";

export const productTypeFragment = gql`
  fragment ProductTypeFragment on ProductType {
    id
    name
    hasVariants
    isShippingRequired
    taxType {
      description
      taxCode
    }
  }
`;

export const productTypeDetailsFragment = gql`
  ${attributeFragment}
  ${productTypeFragment}
  fragment ProductTypeDetailsFragment on ProductType {
    ...ProductTypeFragment
    productAttributes {
      ...AttributeFragment
    }
    variantAttributes {
      ...AttributeFragment
    }
    weight {
      unit
      value
    }
  }
`;

export const productTypeListQuery = gql`
  ${pageInfoFragment}
  ${productTypeFragment}
  query ProductTypeList(
    $after: String
    $before: String
    $first: Int
    $last: Int
    $filter: ProductTypeFilterInput
    $sort: ProductTypeSortingInput
  ) {
    productTypes(
      after: $after
      before: $before
      first: $first
      last: $last
      filter: $filter
      sortBy: $sort
    ) {
      edges {
        node {
          ...ProductTypeFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const useProductTypeListQuery = makeQuery<
  ProductTypeList,
  ProductTypeListVariables
>(productTypeListQuery);

export const productTypeDetailsQuery = gql`
  ${productTypeDetailsFragment}
  query ProductTypeDetails($id: ID!) {
    productType(id: $id) {
      ...ProductTypeDetailsFragment
    }
    shop {
      defaultWeightUnit
    }
    taxTypes {
      taxCode
      description
    }
  }
`;
export const TypedProductTypeDetailsQuery = TypedQuery<
  ProductTypeDetails,
  ProductTypeDetailsVariables
>(productTypeDetailsQuery);

export const productTypeCreateDataQuery = gql`
  query ProductTypeCreateData {
    shop {
      defaultWeightUnit
    }
    taxTypes {
      taxCode
      description
    }
  }
`;
export const TypedProductTypeCreateDataQuery = TypedQuery<
  ProductTypeCreateData,
  {}
>(productTypeCreateDataQuery);
