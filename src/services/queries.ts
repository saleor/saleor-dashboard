import { pageInfoFragment } from "@saleor/fragments/pageInfo";
import {
  serviceDetailsFragment,
  serviceFragment
} from "@saleor/fragments/services";
import makeQuery from "@saleor/hooks/makeQuery";
import gql from "graphql-tag";

import { TypedQuery } from "../queries";
import {
  ServiceDetails,
  ServiceDetailsVariables
} from "./types/ServiceDetails";
import { ServiceList, ServiceListVariables } from "./types/ServiceList";

const serviceList = gql`
  ${pageInfoFragment}
  ${serviceFragment}
  query ServiceList(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filter: ServiceAccountFilterInput
    $sort: ServiceAccountSortingInput
  ) {
    serviceAccounts(
      first: $first
      after: $after
      before: $before
      last: $last
      filter: $filter
      sortBy: $sort
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
export const useServiceListQuery = makeQuery<ServiceList, ServiceListVariables>(
  serviceList
);

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
