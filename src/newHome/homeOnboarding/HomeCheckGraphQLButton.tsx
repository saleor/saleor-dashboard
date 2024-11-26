import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const HomeCheckGraphQLButton = () => {
  const context = useDevModeContext();

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
