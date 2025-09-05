import { ExtensionsPaths } from "@dashboard/extensions/urls";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { PrimaryActionProps } from "./type";

export const WelcomePageWebhooksButton = ({ onClick }: PrimaryActionProps) => {
  return (
    <Link to={ExtensionsPaths.installedExtensions} onClick={onClick}>
      <Button variant="primary">
        <FormattedMessage defaultMessage="Go to Extensions" id="8Mq3ku" description="btn label" />
      </Button>
    </Link>
  );
};
