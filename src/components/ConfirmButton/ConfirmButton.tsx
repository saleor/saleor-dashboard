import { buttonMessages, commonMessages } from "@dashboard/intl";
import CircularProgress from "@material-ui/core/CircularProgress";
import CheckIcon from "@material-ui/icons/Check";
import { Button, ButtonProps } from "@saleor/macaw-ui/next";
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
  children,
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

  const renderContent = () => {
    if (transitionState === "loading") {
      return <CircularProgress size={24} color="inherit" />;
    }

    if (transitionState === "success" && isCompleted) {
      return <CheckIcon />;
    }

    if (transitionState === "error" && isCompleted) {
      return <span>{componentLabels.error}</span>;
    }

    return <span>{children || componentLabels.confirm}</span>;
  };

  return <Button {...props}>{renderContent()}</Button>;
};
