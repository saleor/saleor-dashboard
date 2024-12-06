import { CustomAppSections } from "@dashboard/custom-apps/urls";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { PrimaryActionProps } from "./type";

export const WelcomePageWebhooksButton = ({ onClick }: PrimaryActionProps) => {
  return (
    <Link to={CustomAppSections.appsSection} onClick={onClick}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Go to Webhooks" id="5TzisG" description="btn label" />
      </Button>
    </Link>
  );
};
