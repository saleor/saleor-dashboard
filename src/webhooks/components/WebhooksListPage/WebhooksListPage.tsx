import Button from "@material-ui/core/Button";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import Container from "@saleor/components/Container";
import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import { PageListProps } from "@saleor/types";
import { Webhooks_webhooks_edges_node } from "../../types/Webhooks";
import WebhooksList from "../WebhooksList/WebhooksList";

export interface WebhooksListPageProps extends PageListProps {
  webhooks: Webhooks_webhooks_edges_node[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const WebhooksListPage: React.StatelessComponent<WebhooksListPageProps> = ({
  disabled,
  settings,
  onAdd,
  onBack,
  onNextPage,
  onPreviousPage,
  onRowClick,
  onRemove,
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
      <PageHeader title={intl.formatMessage(sectionNames.webhooks)}>
        <Button onClick={onAdd} variant="contained" color="primary">
          <FormattedMessage
            defaultMessage="Create webhook"
            description="button"
          />
        </Button>
      </PageHeader>
      <WebhooksList
        disabled={disabled}
        settings={settings}
        webhooks={webhooks}
        onNextPage={onNextPage}
        onPreviousPage={onPreviousPage}
        onRemove={onRemove}
        onUpdateListSettings={onUpdateListSettings}
        onRowClick={onRowClick}
        pageInfo={pageInfo}
      />
    </Container>
  );
};
WebhooksListPage.displayName = "WebhooksListPage";
export default WebhooksListPage;
