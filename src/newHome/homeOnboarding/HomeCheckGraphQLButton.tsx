import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { Button, Tooltip } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { HomeFakeDisabledButton } from "./HomeFakeDisabledButton";

export const HomeCheckGraphQLButton = () => {
  const context = useDevModeContext();
  const getTooltipContent = () => {
    return {
      reason: "",
      message: "",
    };
  };

  const canViewGraphQLPlayground = true;

  if (!canViewGraphQLPlayground) {
    const { message } = getTooltipContent();

    return (
      <Tooltip>
        <Tooltip.Trigger>
          <HomeFakeDisabledButton>
            <FormattedMessage
              defaultMessage="Go to GraphQL Playground"
              id="2xkzcr"
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

  return (
    <Button
      variant="primary"
      onClick={() => {
        context.setDevModeVisibility(true);
      }}
    >
      <FormattedMessage
        defaultMessage="Go to GraphQL Playground"
        id="2xkzcr"
        description="btn label"
      />
    </Button>
  );
};
