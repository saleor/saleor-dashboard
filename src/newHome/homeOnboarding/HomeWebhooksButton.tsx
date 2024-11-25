import { CustomAppSections } from "@dashboard/custom-apps/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeWebhooksButton = () => {
  const getTooltipContent = () => {
    return {
      reason: "",
      message: "",
    };
  };

  const canAccessWebhooks = true;

  if (!canAccessWebhooks) {
    const { message } = getTooltipContent();

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton>
            <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
          </HomeFakeDisabledButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {message}
        </Tooltip.Content>
      </Tooltip>
    );
  }

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
