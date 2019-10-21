import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import SearchBar from "@saleor/components/SearchBar";
import { sectionNames } from "@saleor/intl";
import { PageListProps, SearchPageProps, TabPageProps } from "@saleor/types";
import { Webhooks_webhooks_edges_node } from "../../types/Webhooks";
import WebhooksList from "../WebhooksList/WebhooksList";

export interface WebhooksListPageProps
  extends PageListProps,
    SearchPageProps,
    TabPageProps {
  webhooks: Webhooks_webhooks_edges_node[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const WebhooksListPage: React.StatelessComponent<WebhooksListPageProps> = ({
  currentTab,
  initialSearch,
  onAdd,
  onAll,
  onBack,
  onSearchChange,
  onTabChange,
  onTabDelete,
  onTabSave,
  tabs,
  webhooks,
  ...listProps
}) => {
  const intl = useIntl();
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
        <SearchBar
          allTabLabel={intl.formatMessage({
            defaultMessage: "All Webhooks",
            description: "tab name"
          })}
          currentTab={currentTab}
          initialSearch={initialSearch}
          searchPlaceholder={intl.formatMessage({
            defaultMessage: "Search Webhooks"
          })}
          tabs={tabs}
          onAll={onAll}
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
