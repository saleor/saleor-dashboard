import { buttonMessages, commonMessages } from "@dashboard/intl";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from "@material-ui/icons/Check";
import { Button, ButtonProps, sprinkles } from "@saleor/macaw-ui/next";
import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";

const DEFAULT_NOTIFICATION_SHOW_TIME = 3000;

export type ConfirmButtonTransitionState =
  | "default"
  | "loading"
  | "success"
  | "error";

export type ConfirmButtonLabels = Partial<Record<"confirm" | "error", string>>;

export interface ConfirmButtonProps extends ButtonProps {
  labels?: ConfirmButtonLabels;
  noTransition?: boolean;
  transitionState: ConfirmButtonTransitionState;
  onTransitionToDefault?: () => void;
}

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
  const [displayCompletedActionState, setDisplayCompletedActionState] =
    useState(false);
  const timeout = useRef<number>();

  useEffect(() => {
    if (!noTransition && transitionState === "loading") {
      setDisplayCompletedActionState(true);
    }
  }, [transitionState, noTransition]);

  useEffect(() => {
    if (noTransition) {
      return;
    }

    if (
      (["error", "success"] as ConfirmButtonTransitionState[]).includes(
        transitionState,
      )
    ) {
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

  const isCompleted = noTransition
    ? transitionState !== "default"
    : displayCompletedActionState;

  const defaultLabels: ConfirmButtonLabels = {
    confirm: intl.formatMessage(buttonMessages.save),
    error: intl.formatMessage(commonMessages.error),
  };

  const componentLabels: ConfirmButtonLabels = {
    ...defaultLabels,
    ...labels,
  };

  return (
    <Button
      {...props}
      variant={transitionState === "error" && isCompleted ? "error" : variant}
      disabled={!isCompleted && disabled}
      onClick={transitionState === "loading" ? undefined : onClick}
      data-test-state={isCompleted ? transitionState : "default"}
    >
      <CircularProgress
        size={20}
        color="inherit"
        className={sprinkles({
          position: "absolute",
          transition: "ease",
          opacity: transitionState !== "loading" ? "0" : "1",
        })}
      />

      <CheckIcon
        className={sprinkles({
          position: "absolute",
          transition: "ease",
          opacity: !(transitionState === "success" && isCompleted) ? "0" : "1",
        })}
      />

      <span
        className={sprinkles({
          opacity:
            (transitionState === "loading" || transitionState === "success") &&
            isCompleted
              ? "0"
              : "1",
          transition: "ease",
        })}
      >
        {transitionState === "error" && isCompleted
          ? componentLabels.error
          : children || componentLabels.confirm}
      </span>
    </Button>
  );
};
