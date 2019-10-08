import gql from "graphql-tag";

import { pageInfoFragment, TypedQuery } from "../queries";
import {
  ServiceDetails,
  ServiceDetailsVariables
} from "./types/ServiceDetails";
import { ServiceList, ServiceListVariables } from "./types/ServiceList";

export const serviceFragment = gql`
  fragment ServiceFragment on ServiceAccount {
    id
    name
    isActive
  }
`;

const serviceList = gql`
  ${pageInfoFragment}
  ${serviceFragment}
  query ServiceList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ServiceAccountFilterInput
  ) {
    serviceAccounts(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
    ) {
      edges {
        node {
          ...ServiceFragment
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
`;
export const ServiceListQuery = TypedQuery<ServiceList, ServiceListVariables>(
  serviceList
);

export const serviceDetailsFragment = gql`
  ${serviceFragment}
  fragment ServiceDetailsFragment on ServiceAccount {
    ...ServiceFragment
    permissions {
      code
      name
    }
    tokens {
      id
      name
      authToken
    }
  }
`;

const serviceDetails = gql`
  ${serviceDetailsFragment}
  query ServiceDetails($id: ID!) {
    serviceAccount(id: $id) {
      ...ServiceDetailsFragment
    }
  }
`;
export const ServiceDetailsQuery = TypedQuery<
  ServiceDetails,
  ServiceDetailsVariables
>(serviceDetails);
