import "graphiql/graphiql.min.css";

import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import { Card, CardContent } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import { WebhookErrorFragment } from "@saleor/graphql";
import { parse, print} from "graphql";
import React, { useRef, useState } from "react";

// import GraphiQL from "graphiql";
import GraphiQL from "../../../components/GraphiQL";
import { WebhookFormData } from "../WebhookDetailsPage";

interface WebhookSubscriptionQueryProps {
  data: WebhookFormData;
  errors: WebhookErrorFragment[];
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const fetcher = createGraphiQLFetcher({
  url: "https://zaiste.staging.saleor.cloud/graphql/", // TAKE FROM ENV
  fetch,
});

const WebhookSubscriptionQuery: React.FC<WebhookSubscriptionQueryProps> = ({
  data,
  onChange,
}) => {
  let prettified = '';
  try {
    prettified = print(parse(data.subscriptionQuery));
  } catch {
    prettified = data.subscriptionQuery;
  }
  const [query, setQuery] = useState(prettified)
  const ref = useRef(null);

  const explorerPlugin = useExplorerPlugin({
    query,
    onEdit: setQuery,
  });

  return (
    <Card style={{ marginBottom: "2.4rem" }}>
      <CardTitle title="Payload Query" />
      <CardContent style={{ height: 500, padding: 0 }}>
        <GraphiQL
          defaultEditorToolsVisibility={'headers'}
          fetcher={fetcher}
          query={query}
          onEditQuery={input => {
            ref.current.dispatchEvent(new Event("input", { bubbles: true }));
            setQuery(input);
          }}
          plugins={[explorerPlugin]}
          isHeadersEditorEnabled={false}
        />
        <input
          name="subscriptionQuery"
          style={{ display: "none" }}
          value={query}
          ref={ref}
          onInput={onChange}
        />
      </CardContent>
    </Card>
  );
};

WebhookSubscriptionQuery.displayName = "WebhookSubscriptionQuery";
export default WebhookSubscriptionQuery;
