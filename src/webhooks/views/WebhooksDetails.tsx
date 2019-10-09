import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import React from "react";
import { useIntl } from "react-intl";

import { getMutationState, maybe } from "../../misc";
import WebhooksDetailsPage from "../components/WebhooksDetailsPage";
import { TypedWebhookUpdate } from "../mutations";
import { TypedWebhooksDetailsQuery } from "../queries";
import { webhooksListUrl, WebhooksListUrlQueryParams } from "../urls";

export interface WebhooksDetailsProps {
  id: string;
  params: WebhooksListUrlQueryParams;
}

export const WebhooksDetails: React.StatelessComponent<
  WebhooksDetailsProps
> = ({ id }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  return (
    <TypedWebhookUpdate>
      {(webhookUpdate, webhookUpdateOpts) => (
        <TypedWebhooksDetailsQuery variables={{ id }}>
          {WebhookDetails => {
            const formTransitionState = getMutationState(
              webhookUpdateOpts.called,
              webhookUpdateOpts.loading,
              maybe(() => webhookUpdateOpts.data.webhookUpdate.errors)
            );

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

            return (
              <>
                <WindowTitle
                  title={maybe(() => WebhookDetails.data.webhook.name)}
                />
                <WebhooksDetailsPage
                  disabled={WebhookDetails.loading}
                  errors={formErrors}
                  saveButtonBarState={formTransitionState}
                  webhook={maybe(() => WebhookDetails.data.webook)}
                  onBack={() => navigate(webhooksListUrl())}
                  onSubmit={formData => {
                    const configurationInput =
                      formData.configuration &&
                      formData.configuration.map(item => {
                        return {
                          name: item.name,
                          value: item.value.toString()
                        };
                      });
                    webhookUpdate({
                      variables: {
                        id,
                        input: {
                          active: formData.active,
                          configuration: configurationInput
                            ? configurationInput
                            : null
                        }
                      }
                    });
                  }}
                />
              </>
            );
          }}
        </TypedWebhooksDetailsQuery>
      )}
    </TypedWebhookUpdate>
  );
};
WebhooksDetails.displayName = "WebhooksDetails";
export default WebhooksDetails;
