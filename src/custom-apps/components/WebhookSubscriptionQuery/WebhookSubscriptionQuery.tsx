// @ts-strict-ignore
import "graphiql/graphiql.min.css";

import { DashboardCard } from "@dashboard/components/Card";
import { WebhookErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import GraphiQL from "../../../components/GraphiQL";
import { WebhookFormData } from "../WebhookDetailsPage";
import { useStyles } from "./styles";

const messages = defineMessages({
  title: {
    id: "lEG/12",
    defaultMessage: "Subscription Query",
    description: "Webhook subscription query card title",
  },
});

interface WebhookSubscriptionQueryProps {
  query: any;
  setQuery: React.Dispatch<any>;
  data: WebhookFormData;
  errors: WebhookErrorFragment[];
}

const fetcher = createGraphiQLFetcher({
  url: process.env.API_URL,
});
const WebhookSubscriptionQuery: React.FC<WebhookSubscriptionQueryProps> = ({
  errors,
  query,
  setQuery,
  data,
}) => {
  const intl = useIntl();
  const explorerPlugin = useExplorerPlugin({
    query,
    onEdit: setQuery,
    showAttribution: false,
  });
  const classes = useStyles();
  const formErrors = getFormErrors(["subscriptionQuery"], errors);

  return (
    <DashboardCard className={classes.card}>
      <DashboardCard.Title color={formErrors.subscriptionQuery ? "critical1" : null}>
        {intl.formatMessage(messages.title)}

        <DashboardCard.Subtitle>{formErrors.subscriptionQuery?.message}</DashboardCard.Subtitle>
      </DashboardCard.Title>
      <DashboardCard.Content className={classes.cardContent}>
        <GraphiQL
          data-test-id="graphiql-webhook"
          defaultEditorToolsVisibility={"headers"}
          fetcher={fetcher}
          query={query}
          storage={null}
          onEditQuery={setQuery}
          plugins={[explorerPlugin]}
          isHeadersEditorEnabled={false}
          data={data}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WebhookSubscriptionQuery.displayName = "WebhookSubscriptionQuery";
export default WebhookSubscriptionQuery;
