import {
  filterPageProps,
  listActionsProps,
  pageListProps,
  searchPageProps,
  sortPageProps,
  tabPageProps
} from "@saleor/fixtures";
import Decorator from "@saleor/storybook/Decorator";
import { WebhookListUrlSortField } from "@saleor/webhooks/urls";
import { storiesOf } from "@storybook/react";
import React from "react";

import { webhookList } from "../../fixtures";
import WebhooksListPage, { WebhooksListPageProps } from "./WebhooksListPage";

const props: WebhooksListPageProps = {
  ...listActionsProps,
  ...pageListProps.default,
  ...searchPageProps,
  ...sortPageProps,
  ...tabPageProps,
  ...filterPageProps,
  filterOpts: {
    isActive: {
      active: false,
      value: true
    }
  },
  onBack: () => undefined,
  onRemove: () => undefined,
  sort: {
    ...sortPageProps.sort,
    sort: WebhookListUrlSortField.name
  },
  webhooks: webhookList
};

storiesOf("Views / Webhooks / Webhook list", module)
  .addDecorator(Decorator)
  .add("default", () => <WebhooksListPage {...props} />)
  .add("loading", () => (
    <WebhooksListPage {...props} disabled={true} webhooks={undefined} />
  ))
  .add("no data", () => <WebhooksListPage {...props} webhooks={[]} />);
