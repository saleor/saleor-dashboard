import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import Button from "@material-ui/core/Button";

import PageHeader from "@saleor/components/PageHeader";
import { sectionNames } from "@saleor/intl";
import Container from "@saleor/components/Container";
import CardSpacer from "@saleor/components/CardSpacer";
import { ListProps } from "@saleor/types";
import ExtensionMarketplaceAd from "../ExtensionMarketplaceAd";
import ExtensionList from "../ExtensionList";

export interface ExtensionListPageProps extends ListProps {
  extensions: Array<Record<"id" | "author" | "icon" | "name" | "url", string>>;
  onMarketplaceClick: () => void;
}

const ExtensionListPage: React.FC<ExtensionListPageProps> = ({
  onMarketplaceClick,
  ...listProps
}) => {
  const intl = useIntl();

  return (
    <Container>
      <PageHeader title={intl.formatMessage(sectionNames.extensions)}>
        <Button
          color="primary"
          variant="contained"
          onClick={onMarketplaceClick}
        >
          <FormattedMessage
            defaultMessage="Visit Marketplace"
            description="button"
          />
        </Button>
      </PageHeader>
      <ExtensionList {...listProps} />
      <CardSpacer />
      <ExtensionMarketplaceAd onMarketplaceClick={onMarketplaceClick} />
    </Container>
  );
};

export default ExtensionListPage;
