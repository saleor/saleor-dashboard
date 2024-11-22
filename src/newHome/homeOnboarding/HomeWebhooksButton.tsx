import { CustomAppSections } from "@dashboard/custom-apps/urls";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const HomeWebhooksButton = () => {
  const goToWebhooksUrl = CustomAppSections.appsSection;

  return (
    <Button
      as="a"
      href={goToWebhooksUrl}
      target="_blank"
      rel="noreferrer noopener"
      variant="primary"
    >
      <FormattedMessage defaultMessage="Go to Webhooks" id="5TzisG" description="btn label" />
    </Button>
  );
};
