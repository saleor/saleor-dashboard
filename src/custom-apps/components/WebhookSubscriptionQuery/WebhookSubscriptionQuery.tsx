// @ts-strict-ignore
import "graphiql/graphiql.min.css";

import CardTitle from "@dashboard/components/CardTitle";
import { WebhookErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Card, CardContent } from "@material-ui/core";
import clsx from "clsx";
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
  url: process.env.API_URI,
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
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage(messages.title)}
        subtitle={formErrors.subscriptionQuery?.message}
        className={clsx(formErrors.subscriptionQuery && classes.error)}
      />
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
