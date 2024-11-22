import { CustomAppSections } from "@dashboard/custom-apps/urls";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

export const HomeWebhooksButton = () => {
  return (
    <Link to={CustomAppSections.appsSection}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Go to Webhooks" id="5TzisG" description="btn label" />
      </Button>
    </Link>
  );
};
