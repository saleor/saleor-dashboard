import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { serviceFragment } from "./queries";
import { ServiceCreate, ServiceCreateVariables } from "./types/ServiceCreate";

export const serviceCreateMutation = gql`
  ${serviceFragment}
  mutation ServiceCreate($input: ServiceAccountInput!) {
    serviceAccountCreate(input: $input) {
      errors {
        field
        message
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
