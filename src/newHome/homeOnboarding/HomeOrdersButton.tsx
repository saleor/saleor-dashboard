import { orderListUrl } from "@dashboard/orders/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeOrdersButton = () => {
  const getTooltipContent = () => {
    return {
      reason: "",
      message: "",
    };
  };

  const canViewOrders = true;

  if (!canViewOrders) {
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

  const goToOrdersUrl = orderListUrl();

  return (
    <Button as="a" href={goToOrdersUrl} target="_blank" rel="noreferrer noopener" variant="primary">
      <FormattedMessage defaultMessage="Go to orders" id="kv3FWU" description="btn label" />
    </Button>
  );
};
