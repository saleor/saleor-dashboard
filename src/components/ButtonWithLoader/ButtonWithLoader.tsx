import { SaleorThrobber } from "@dashboard/components/Throbber";
import { buttonMessages } from "@dashboard/intl";
import { Button, type ButtonProps, sprinkles } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { type ConfirmButtonTransitionState } from "../ConfirmButton";

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

  const renderLoader = () => {
    if (isLoading) {
      return (
        <SaleorThrobber
          size={20}
          data-test-id="button-progress"
          className={sprinkles({
            position: "absolute",
          })}
        />
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
      disabled={isLoading || disabled}
      onClick={isLoading ? undefined : onClick}
      data-test-state={isLoading ? "loading" : "default"}
    >
      {renderLoader()}
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
