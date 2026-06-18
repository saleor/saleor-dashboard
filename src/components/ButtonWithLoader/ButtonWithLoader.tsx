import { SaleorThrobber } from "@dashboard/components/Throbber";
import { buttonMessages } from "@dashboard/intl";
import { Button, type ButtonProps, sprinkles } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { useIntl } from "react-intl";

import { type ConfirmButtonTransitionState } from "../ConfirmButton";
import styles from "./ButtonWithLoader.module.css";

interface ButtonWithLoaderProps extends ButtonProps {
  transitionState: ConfirmButtonTransitionState;
}

export const ButtonWithLoader = ({
  transitionState,
  onClick,
  disabled,
  children,
  className,
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
      className={clsx(className, isLoading && styles.noInteraction)}
      disabled={disabled}
      aria-busy={isLoading}
      tabIndex={isLoading ? -1 : undefined}
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
