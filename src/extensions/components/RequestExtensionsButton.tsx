import { MISSING_APPS_TYPEFORM_URL } from "@dashboard/links";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { messages as extensionsMessages } from "../messages";

export const CONST_TYPEFORM_URL = `${MISSING_APPS_TYPEFORM_URL}?utm_button=${encodeURIComponent("Request integration")}`;

export const RequestExtensionsButton = () => {
  const intl = useIntl();

  return (
    <Button variant="secondary" target="_blank" as="a" href={CONST_TYPEFORM_URL}>
      {intl.formatMessage(extensionsMessages.missingExtensionsButton)}
    </Button>
  );
};
