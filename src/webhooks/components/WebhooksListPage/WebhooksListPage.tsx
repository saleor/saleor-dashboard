import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import FilterBar from "@saleor/components/FilterBar";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import {
  FilterPageProps,
  PageListProps,
  SortPage,
  TabPageProps
} from "@saleor/types";
import { WebhookListUrlSortField } from "@saleor/webhooks/urls";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { Webhooks_webhooks_edges_node } from "../../types/Webhooks";
import WebhooksList from "../WebhooksList";
import {
  createFilterStructure,
  WebhookFilterKeys,
  WebhookListFilterOpts
} from "./filters";

export interface WebhooksListPageProps
  extends PageListProps,
    FilterPageProps<WebhookFilterKeys, WebhookListFilterOpts>,
    SortPage<WebhookListUrlSortField>,
    TabPageProps {
  webhooks: Webhooks_webhooks_edges_node[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const WebhooksListPage: React.FC<WebhooksListPageProps> = ({
  currencySymbol,
  currentTab,
  filterOpts,
  initialSearch,
  onAdd,
  onAll,
  onBack,
  onFilterChange,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  webhooks,
  ...listProps
}) => {
  const intl = useIntl();

  const structure = createFilterStructure(intl, filterOpts);

  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.webhooks)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage
            defaultMessage="Create webhook"
            description="button"
          />
        </Button>
      </PageHeader>
      <Card>
        <FilterBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Webhooks",
            description: "tab name"
          })}
          currencySymbol={currencySymbol}
          currentTab={currentTab}
          filterStructure={structure}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Webhooks"
          })}
          tabs={tabs}
          onAll={onAll}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onTabChange={onTabChange}
          onTabDelete={onTabDelete}
          onTabSave={onTabSave}
        />
        <WebhooksList webhooks={webhooks} {...listProps} />
      </Card>
    </Container>
  );
};
WebhooksListPage.displayName = "WebhooksListPage";
export default WebhooksListPage;
