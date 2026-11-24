// @ts-strict-ignore
import "graphiql/graphiql.min.css";

import { DashboardCard } from "@dashboard/components/Card";
import GraphiQL from "@dashboard/components/GraphiQL/GraphiQL";
import { type WebhookErrorFragment } from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { useExplorerPlugin } from "@graphiql/plugin-explorer";
import { createGraphiQLFetcher } from "@graphiql/toolkit";
import type * as React from "react";
import { defineMessages, useIntl } from "react-intl";

import { type WebhookFormData } from "../../WebhookDetailsPage";

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

export const WebhookSubscriptionQuery = ({
  errors,
  query,
  setQuery,
  data,
}: WebhookSubscriptionQueryProps) => {
  const intl = useIntl();
  const explorerPlugin = useExplorerPlugin({
    query,
    onEdit: setQuery,
    showAttribution: false,
  });
  const formErrors = getFormErrors(["subscriptionQuery"], errors);

  return (
    <DashboardCard __marginBottom="1.6rem">
      <DashboardCard.Header>
        <DashboardCard.Title color={formErrors.subscriptionQuery ? "critical1" : null}>
          {intl.formatMessage(messages.title)}

          <DashboardCard.Subtitle>{formErrors.subscriptionQuery?.message}</DashboardCard.Subtitle>
        </DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content __height="500px" paddingX={0}>
        <GraphiQL
          fetcher={fetcher}
          query={query}
          storage={null}
          onEditQuery={setQuery}
          plugins={[explorerPlugin]}
          data={data}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

WebhookSubscriptionQuery.displayName = "WebhookSubscriptionQuery";
