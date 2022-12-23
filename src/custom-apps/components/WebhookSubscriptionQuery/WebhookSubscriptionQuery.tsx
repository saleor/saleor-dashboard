import "graphiql/graphiql.min.css";

import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";

import GraphiQL from "../../../components/GraphiQL";

interface WebhookSubscriptionQueryProps {
  query: any;
  setQuery: React.Dispatch<any>;
}

export const fetcher = createGraphiQLFetcher({
  url: "https://zaiste.staging.saleor.cloud/graphql/", // TAKE FROM ENV
  fetch,
});

const WebhookSubscriptionQuery: React.FC<WebhookSubscriptionQueryProps> = ({
  query,
  setQuery,
}) => {
  const explorerPlugin = useExplorerPlugin({
    query,
    onEdit: setQuery,
  });

  return (
    <Card style={{ marginBottom: "2.4rem" }}>
      <CardTitle title="Payload Query" />
      <CardContent style={{ height: 500, padding: 0 }}>
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
