import { productListUrl } from "@dashboard/products/urls";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeCreateProductButton = () => {
  const getTooltipContent = () => {
    return {
      reason: "",
      message: "",
    };
  };

  const canViewProducts = true;

  if (!canViewProducts) {
    const { message } = getTooltipContent();

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton>
            <FormattedMessage
              defaultMessage="Go to all products"
              id="XZpRr8"
              description="btn label"
            />
          </HomeFakeDisabledButton>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <Tooltip.Arrow />
          {message}
        </Tooltip.Content>
      </Tooltip>
    );
  }

  const goToAllProductsUrl = productListUrl();

  return (
    <Button
      as="a"
      href={goToAllProductsUrl}
      target="_blank"
      rel="noreferrer noopener"
      variant="primary"
    >
      <FormattedMessage defaultMessage="Go to all products" id="XZpRr8" description="btn label" />
    </Button>
  );
};
