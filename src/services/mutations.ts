import gql from "graphql-tag";

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
  ${serviceFragment}
  mutation ServiceCreate($input: ServiceAccountInput!) {
    serviceAccountCreate(input: $input) {
      errors {
        field
        message
      }
      authToken
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
  mutation ServiceDelete($id: ID!) {
    serviceAccountDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const ServiceDeleteMutation = TypedMutation<
  ServiceDelete,
  ServiceDeleteVariables
>(serviceDeleteMutation);

const serviceUpdateMutation = gql`
  ${serviceDetailsFragment}
  mutation ServiceUpdate($id: ID!, $input: ServiceAccountInput!) {
    serviceAccountUpdate(id: $id, input: $input) {
      errors {
        field
        message
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
  mutation ServiceTokenCreate($input: ServiceAccountTokenInput!) {
    serviceAccountTokenCreate(input: $input) {
      errors {
        field
        message
      }
      authToken
    }
  }
`;
export const ServiceTokenCreateMutation = TypedMutation<
  ServiceTokenCreate,
  ServiceTokenCreateVariables
>(serviceTokenCreate);

const serviceTokenDelete = gql`
  mutation ServiceTokenDelete($id: ID!) {
    serviceAccountTokenDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const ServiceTokenDeleteMutation = TypedMutation<
  ServiceTokenDelete,
  ServiceTokenDeleteVariables
>(serviceTokenDelete);
