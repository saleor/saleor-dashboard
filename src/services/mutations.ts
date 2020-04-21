import gql from "graphql-tag";

import { accountErrorFragment } from "@saleor/customers/mutations";
import { TypedMutation } from "../mutations";
import { serviceDetailsFragment, serviceFragment } from "./queries";
import { ServiceCreate, ServiceCreateVariables } from "./types/ServiceCreate";
import { ServiceDelete, ServiceDeleteVariables } from "./types/ServiceDelete";
import {
  ServiceTokenCreate,
  ServiceTokenCreateVariables
} from "./types/ServiceTokenCreate";
import {
  ServiceTokenDelete,
  ServiceTokenDeleteVariables
} from "./types/ServiceTokenDelete";
import { ServiceUpdate, ServiceUpdateVariables } from "./types/ServiceUpdate";

const serviceCreateMutation = gql`
  ${accountErrorFragment}
  ${serviceFragment}
  mutation ServiceCreate($input: ServiceAccountInput!) {
    serviceAccountCreate(input: $input) {
      authToken
      errors: accountErrors {
        ...AccountErrorFragment
      }
      serviceAccount {
        ...ServiceFragment
      }
    }
  }
`;

export const ServiceCreateMutation = TypedMutation<
  ServiceCreate,
  ServiceCreateVariables
>(serviceCreateMutation);

const serviceDeleteMutation = gql`
  ${accountErrorFragment}
  mutation ServiceDelete($id: ID!) {
    serviceAccountDelete(id: $id) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const ServiceDeleteMutation = TypedMutation<
  ServiceDelete,
  ServiceDeleteVariables
>(serviceDeleteMutation);

const serviceUpdateMutation = gql`
  ${accountErrorFragment}
  ${serviceDetailsFragment}
  mutation ServiceUpdate($id: ID!, $input: ServiceAccountInput!) {
    serviceAccountUpdate(id: $id, input: $input) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
      serviceAccount {
        ...ServiceDetailsFragment
      }
    }
  }
`;

export const ServiceUpdateMutation = TypedMutation<
  ServiceUpdate,
  ServiceUpdateVariables
>(serviceUpdateMutation);

const serviceTokenCreate = gql`
  ${accountErrorFragment}
  mutation ServiceTokenCreate($input: ServiceAccountTokenInput!) {
    serviceAccountTokenCreate(input: $input) {
      authToken
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const ServiceTokenCreateMutation = TypedMutation<
  ServiceTokenCreate,
  ServiceTokenCreateVariables
>(serviceTokenCreate);

const serviceTokenDelete = gql`
  ${accountErrorFragment}
  mutation ServiceTokenDelete($id: ID!) {
    serviceAccountTokenDelete(id: $id) {
      errors: accountErrors {
        ...AccountErrorFragment
      }
    }
  }
`;
export const ServiceTokenDeleteMutation = TypedMutation<
  ServiceTokenDelete,
  ServiceTokenDeleteVariables
>(serviceTokenDelete);
