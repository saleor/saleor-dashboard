import { SaleorThrobber } from "@dashboard/components/Throbber";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import CheckIcon from "@material-ui/icons/Check";
import { Button, ButtonProps, sprinkles } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;

export type ConfirmButtonTransitionState = "default" | "loading" | "success" | "error";

type ConfirmButtonLabels = Partial<Record<"confirm" | "error", string>>;

export interface ConfirmButtonProps extends ButtonProps {
  labels?: ConfirmButtonLabels;
  noTransition?: boolean;
  transitionState: ConfirmButtonTransitionState;
  onTransitionToDefault?: () => void;
}

// Here you can find original implementation
// https://github.com/saleor/macaw-ui/blob/canary/legacy/src/ConfirmButton/ConfirmButton.tsx

export const ConfirmButton = ({
  labels,
  noTransition,
  transitionState,
  onTransitionToDefault,
  onClick,
  disabled,
  children,
  variant,
  ...props
}: ConfirmButtonProps) => {
  const intl = useIntl();
  const [displayCompletedActionState, setDisplayCompletedActionState] = useState(false);
  const timeout = useRef<number>();
  const isCompleted = noTransition ? transitionState !== "default" : displayCompletedActionState;
  const isError = transitionState === "error" && isCompleted;
  const defaultLabels: ConfirmButtonLabels = {
    confirm: intl.formatMessage(buttonMessages.save),
    error: intl.formatMessage(commonMessages.error),
  };
  const componentLabels: ConfirmButtonLabels = {
    ...defaultLabels,
    ...labels,
  };

  useEffect(() => {
    if (!noTransition && transitionState === "loading") {
      setDisplayCompletedActionState(true);
    }
  }, [transitionState, noTransition]);
  useEffect(() => {
    if (noTransition) {
      return;
    }

    if ((["error", "success"] as ConfirmButtonTransitionState[]).includes(transitionState)) {
      timeout.current = setTimeout(() => {
        setDisplayCompletedActionState(false);

        if (onTransitionToDefault) {
          onTransitionToDefault();
        }
      }, DEFAULT_NOTIFICATION_SHOW_TIME) as unknown as number;
    } else if (transitionState === "loading") {
      clearTimeout(timeout.current);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [noTransition, transitionState, onTransitionToDefault]);

  const renderContent = () => {
    if (transitionState === "loading") {
      return (
        // TODO: Replace with new component when it will be ready https://github.com/saleor/macaw-ui/issues/443
        <SaleorThrobber
          size={20}
          data-test-id="button-progress"
          className={sprinkles({
            position: "absolute",
          })}
        />
      );
    }

    if (transitionState === "success" && isCompleted) {
      return (
        // TODO: Replace with new component when it will be ready https://github.com/saleor/macaw-ui/issues/443
        <CheckIcon
          data-test-id="button-success"
          className={sprinkles({
            position: "absolute",
          })}
        />
      );
    }

    return null;
  };
  const getByLabelText = () => {
    if (isError) {
      return componentLabels.error;
    }

    return children || componentLabels.confirm;
  };

  return (
    <Button
      {...props}
      variant={isError ? "error" : variant}
      disabled={!isCompleted && disabled}
      onClick={transitionState === "loading" ? undefined : onClick}
      data-test-state={isCompleted ? transitionState : "default"}
    >
      {renderContent()}
      <span
        className={sprinkles({
          opacity: ["loading", "success"].includes(transitionState) && isCompleted ? "0" : "1",
          transition: "ease",
        })}
      >
        {getByLabelText()}
      </span>
    </Button>
  );
};
