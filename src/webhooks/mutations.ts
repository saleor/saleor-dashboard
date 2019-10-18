import gql from "graphql-tag";

import { TypedMutation } from "../mutations";
import { webhooksDetailsFragment } from "./queries";
import { WebhookCreate, WebhookCreateVariables } from "./types/WebhookCreate";
import { WebhookDelete, WebhookDeleteVariables } from "./types/WebhookDelete";
import { WebhookUpdate, WebhookUpdateVariables } from "./types/WebhookUpdate";

const webhookCreate = gql`
  ${webhooksDetailsFragment}
  mutation WebhookCreate($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      errors {
        field
        message
      }
      webhookErrors {
        code
        message
        field
      }
      webhook {
        ...WebhooksDetailsFragment
      }
    }
  }
`;
export const TypedWebhookCreate = TypedMutation<
  WebhookCreate,
  WebhookCreateVariables
>(webhookCreate);

const webhookUpdate = gql`
  ${webhooksDetailsFragment}
  mutation WebhookUpdate($id: ID!, $input: WebhookUpdateInput!) {
    webhookUpdate(id: $id, input: $input) {
      errors {
        field
        message
      }
      webhookErrors {
        code
        message
        field
      }
      webhook {
        ...WebhooksDetailsFragment
      }
    }
  }
`;
export const TypedWebhookUpdate = TypedMutation<
  WebhookUpdate,
  WebhookUpdateVariables
>(webhookUpdate);

const webhookDelete = gql`
  mutation WebhookDelete($id: ID!) {
    webhookDelete(id: $id) {
      errors {
        field
        message
      }
    }
  }
`;
export const TypedWebhookDelete = TypedMutation<
  WebhookDelete,
  WebhookDeleteVariables
>(webhookDelete);
