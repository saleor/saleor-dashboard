import { webhookErrorFragment } from "@saleor/fragments/errors";
import { webhooksDetailsFragment } from "@saleor/fragments/webhooks";
import makeMutation from "@saleor/hooks/makeMutation";
import gql from "graphql-tag";

import { WebhookCreate, WebhookCreateVariables } from "./types/WebhookCreate";
import { WebhookDelete, WebhookDeleteVariables } from "./types/WebhookDelete";
import { WebhookUpdate, WebhookUpdateVariables } from "./types/WebhookUpdate";

const webhookCreate = gql`
  ${webhooksDetailsFragment}
  ${webhookErrorFragment}
  mutation WebhookCreate($input: WebhookCreateInput!) {
    webhookCreate(input: $input) {
      errors: webhookErrors {
        ...WebhookErrorFragment
      }
      webhook {
        ...WebhooksDetailsFragment
      }
    }
  }
`;

const webhookUpdate = gql`
  ${webhooksDetailsFragment}
  ${webhookErrorFragment}
  mutation WebhookUpdate($id: ID!, $input: WebhookUpdateInput!) {
    webhookUpdate(id: $id, input: $input) {
      errors: webhookErrors {
        ...WebhookErrorFragment
      }
      webhook {
        ...WebhooksDetailsFragment
      }
    }
  }
`;

const webhookDelete = gql`
  ${webhookErrorFragment}
  mutation WebhookDelete($id: ID!) {
    webhookDelete(id: $id) {
      errors: webhookErrors {
        ...WebhookErrorFragment
      }
    }
  }
`;

export const useWebhookCreateMutation = makeMutation<
  WebhookCreate,
  WebhookCreateVariables
>(webhookCreate);

export const useWebhookDeleteMutation = makeMutation<
  WebhookDelete,
  WebhookDeleteVariables
>(webhookDelete);

export const useWebhookUpdateMutation = makeMutation<
  WebhookUpdate,
  WebhookUpdateVariables
>(webhookUpdate);
