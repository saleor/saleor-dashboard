import { buttonMessages } from "@dashboard/intl";
import { Box, Button, ButtonProps, Spinner, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { ConfirmButtonTransitionState } from "../ConfirmButton";

interface ButtonWithLoaderProps extends ButtonProps {
  transitionState: ConfirmButtonTransitionState;
}

export const ButtonWithLoader = ({
  transitionState,
  onClick,
  disabled,
  children,
  ...props
}: ButtonWithLoaderProps) => {
  const intl = useIntl();
  const isLoading = transitionState === "loading";

  const renderSpinner = () => {
    if (isLoading) {
      return (
        <Box data-test-id="button-progress" display="flex" position="absolute">
          <Spinner />
        </Box>
      );
    }

    return null;
  };

  const getByLabelText = () => {
    return children || intl.formatMessage(buttonMessages.save);
  };

  return (
    <Button
      {...props}
      disabled={isLoading && disabled}
      onClick={isLoading ? undefined : onClick}
      data-test-state={isLoading ? "loading" : "default"}
    >
      {renderSpinner()}
      <span
        className={sprinkles({
          opacity: isLoading ? "0" : "1",
          transition: "ease",
        })}
      >
        {getByLabelText()}
      </span>
    </Button>
  );
};
