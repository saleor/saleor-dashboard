// @ts-strict-ignore
import "graphiql/graphiql.min.css";

import CardTitle from "@dashboard/components/CardTitle";
import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Card, CardContent } from "@material-ui/core";
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
}

const fetcher = createGraphiQLFetcher({
  url: process.env.API_URI,
});

const WebhookSubscriptionQuery: React.FC<WebhookSubscriptionQueryProps> = ({
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

  return (
    <Card className={classes.card}>
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent className={classes.cardContent}>
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
      </CardContent>
    </Card>
  );
};

WebhookSubscriptionQuery.displayName = "WebhookSubscriptionQuery";
export default WebhookSubscriptionQuery;
