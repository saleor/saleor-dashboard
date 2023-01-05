import "graphiql/graphiql.min.css";

import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { makeStyles } from "@saleor/macaw-ui";
import clsx from "clsx";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import GraphiQL from "../../../components/GraphiQL";
import { WebhookFormData } from "../WebhookDetailsPage";

const messages = defineMessages({
  title: {
    id: "QpSQ5w",
    defaultMessage: "Payload Query",
    description: "Webhook subscription query card title",
  },
});

const useStyles = makeStyles(
  theme => ({
    disabled: {
      pointerEvents: "none",
      opacity: 0.6,
    },
    cardContent: {
      height: 500,
      padding: 0,
    },
    card: {
      marginBottom: theme.spacing(2),
    },
  }),
  { name: "WebhookSubscriptionQuery" },
);

interface WebhookSubscriptionQueryProps {
  query: any;
  setQuery: React.Dispatch<any>;
  data: WebhookFormData;
}

const fetcher = createGraphiQLFetcher({
  url: process.env.API_URI,
  fetch,
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
  });

  const classes = useStyles();

  return (
    <Card
      className={clsx(classes.card, data.syncEvents.length && classes.disabled)}
    >
      <CardTitle title={intl.formatMessage(messages.title)} />
      <CardContent className={classes.cardContent}>
        <GraphiQL
          defaultEditorToolsVisibility={"headers"}
          fetcher={fetcher}
          query={query}
          onEditQuery={setQuery}
          plugins={[explorerPlugin]}
          isHeadersEditorEnabled={false}
        />
      </CardContent>
    </Card>
  );
};

WebhookSubscriptionQuery.displayName = "WebhookSubscriptionQuery";
export default WebhookSubscriptionQuery;
