import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { Button } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { PrimaryActionProps } from "./type";

export const WelcomePageCheckGraphQLButton: React.FC<PrimaryActionProps> = ({ onClick }) => {
  const context = useDevModeContext();

  return (
    <Button
      variant="primary"
      onClick={() => {
        onClick();
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
