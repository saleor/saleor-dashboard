import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { commonMessages } from "@saleor/intl";
import WebhookDeleteDialog from "@saleor/webhooks/components/WebhookDeleteDialog";
import { WebhookDelete } from "@saleor/webhooks/types/WebhookDelete";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { TypedWebhookDelete, TypedWebhookUpdate } from "../mutations";
import { TypedServiceListQuery, TypedWebhooksDetailsQuery } from "../queries";
import {
  webhooksListUrl,
  WebhooksListUrlQueryParams,
  webhooksUrl,
  WebhookUrlDialog
} from "../urls";

export interface WebhooksDetailsProps {
  id: string;
  params: WebhooksListUrlQueryParams;
}

export const WebhooksDetails: React.StatelessComponent<
  WebhooksDetailsProps
> = ({ id, params }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const closeModal = () =>
    navigate(
      webhooksUrl(id, {
        ...params,
        action: undefined,
        id: undefined
      }),
      true
    );

  const openModal = (action: WebhookUrlDialog, tokenId?: string) =>
    navigate(
      webhooksUrl(id, {
        ...params,
        action,
        id: tokenId
      })
    );

  const onWebhookDelete = (data: WebhookDelete) => {
    if (data.webhookDelete.errors.length === 0) {
      notify({
        text: intl.formatMessage(commonMessages.savedChanges)
      });
      navigate(webhooksListUrl());
    }
  };

  return (
    <TypedWebhookUpdate>
      {(webhookUpdate, webhookUpdateOpts) => (
        <TypedWebhookDelete onCompleted={onWebhookDelete}>
          {(webhookDelete, webhookDeleteOpts) => (
            <TypedWebhooksDetailsQuery variables={{ id }}>
              {WebhookDetails => {
                const formTransitionState = getMutationState(
                  webhookUpdateOpts.called,
                  webhookUpdateOpts.loading,
                  maybe(() => webhookUpdateOpts.data.webhookUpdate.errors)
                );

                const handleRemoveConfirm = () =>
                  webhookDelete({
                    variables: {
                      id
                    }
                  });

                const formErrors = maybe(
                  () => webhookUpdateOpts.data.webhookUpdate.errors,
                  []
                );

                if (formErrors.length) {
                  formErrors.map(error => {
                    notify({
                      text: error.message
                    });
                  });
                } else {
                  if (webhookUpdateOpts.data) {
                    notify({
                      text: intl.formatMessage({
                        defaultMessage: "Succesfully updated plugin settings",
                        description: "plugin success message"
                      })
                    });
                  }
                }

                const deleteTransitionState = getMutationState(
                  webhookDeleteOpts.called,
                  webhookDeleteOpts.loading,
                  maybe(() => webhookDeleteOpts.data.webhookDelete.errors)
                );

                return (
                  <TypedServiceListQuery variables={{ first: 99 }}>
                    {({ data }) => (
                      <>
                        <WindowTitle
                          title={maybe(() => WebhookDetails.data.webhook.name)}
                        />
                        <WebhooksDetailsPage
                          disabled={WebhookDetails.loading}
                          errors={formErrors}
                          saveButtonBarState={formTransitionState}
                          webhook={maybe(() => WebhookDetails.data.webhook)}
                          services={maybe(() =>
                            data.serviceAccounts.edges.map(edge => edge.node)
                          )}
                          onBack={() => navigate(webhooksListUrl())}
                          onDelete={() => openModal("remove")}
                          onSubmit={data => {
                            webhookUpdate({
                              variables: {
                                id,
                                input: {
                                  events: data.events,
                                  isActive: data.isActive,
                                  name: data.name,
                                  secretKey: data.secretKey,
                                  serviceAccount: data.serviceAccount,
                                  targetUrl: data.targetUrl
                                }
                              }
                            });
                          }}
                        />
                        <WebhookDeleteDialog
                          confirmButtonState={deleteTransitionState}
                          name={maybe(
                            () => WebhookDetails.data.webhook.name,
                            "..."
                          )}
                          onClose={closeModal}
                          onConfirm={handleRemoveConfirm}
                          open={params.action === "remove"}
                        />
                      </>
                    )}
                  </TypedServiceListQuery>
                );
              }}
            </TypedWebhooksDetailsQuery>
          )}
        </TypedWebhookDelete>
      )}
    </TypedWebhookUpdate>
  );
};
WebhooksDetails.displayName = "WebhooksDetails";
export default WebhooksDetails;
