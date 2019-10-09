import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PageListProps } from "@saleor/types";
import { Plugins_plugins_edges_node } from "../../types/Plugins";
import WebhooksList from "../WebhooksList/WebhooksList";

export interface WebhooksListPageProps extends PageListProps {
  plugins: Plugins_plugins_edges_node[];
  onBack: () => void;
}

const WebhooksListPage: React.StatelessComponent<WebhooksListPageProps> = ({
  disabled,
  settings,
  onBack,
  onNextPage,
  onPreviousPage,
  onRowClick,
  onUpdateListSettings,
  pageInfo,
  webhooks
}) => {
  const intl = useIntl();
  return (
    <Container>
      <AppHeader onBack={onBack}>
        {intl.formatMessage(sectionNames.configuration)}
      </AppHeader>
      <PageHeader title={intl.formatMessage(sectionNames.webhooks)} />
      <WebhooksList
        disabled={disabled}
        settings={settings}
        webhooks={webhooks}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onUpdateListSettings={onUpdateListSettings}
        onRowClick={onRowClick}
        pageInfo={pageInfo}
      />
    </Container>
  );
};
WebhooksListPage.displayName = "WebhooksListPage";
export default WebhooksListPage;
