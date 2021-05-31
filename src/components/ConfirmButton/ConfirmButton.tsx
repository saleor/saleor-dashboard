import { Button, CircularProgress } from "@material-ui/core";
import { ButtonProps } from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@saleor/config";
import { buttonMessages } from "@saleor/intl";
import { makeStyles } from "@saleor/macaw-ui";
import classNames from "classnames";
import React from "react";
import { FormattedMessage } from "react-intl";

export type ConfirmButtonTransitionState =
  | "loading"
  | "success"
  | "error"
  | "default";

const useStyles = makeStyles(
  theme => ({
    error: {
      "&:hover": {
        backgroundColor: theme.palette.error.main
      },
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText
    },
    icon: {
      marginLeft: "0 !important",
      position: "absolute",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    invisible: {
      opacity: 0
    },
    label: {
      alignItems: "center",
      display: "flex",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    progress: {
      "& svg": {
        color: theme.palette.common.white,
        margin: 0
      },
      position: "absolute",
      transitionDuration: theme.transitions.duration.standard + "ms"
    },
    success: {
      "&:hover": {
        backgroundColor: theme.palette.primary.main
      },
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  }),
  { name: "ConfirmButton" }
);

export interface ConfirmButtonProps extends Omit<ButtonProps, "classes"> {
  transitionState: ConfirmButtonTransitionState;
  onTransitionToDefault?: () => void;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  className,
  disabled,
  transitionState,
  onClick,
  onTransitionToDefault,
  ...props
}) => {
  const classes = useStyles();
  const [
    displayCompletedActionState,
    setDisplayCompletedActionState
  ] = React.useState(false);
  const timeout = React.useRef<number>();

  React.useEffect(() => {
    if (transitionState === "loading") {
      setDisplayCompletedActionState(true);
    }
  }, [transitionState]);

  React.useEffect(() => {
    if (
      (["error", "success"] as ConfirmButtonTransitionState[]).includes(
        transitionState
      )
    ) {
      timeout.current = (setTimeout(() => {
        setDisplayCompletedActionState(false);
        if (onTransitionToDefault) {
          onTransitionToDefault();
        }
      }, DEFAULT_NOTIFICATION_SHOW_TIME) as unknown) as number;
    } else if (transitionState === "loading") {
      clearTimeout(timeout.current);
    }

    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return (
    <Button
      variant="contained"
      onClick={transitionState === "loading" ? undefined : onClick}
      color="primary"
      className={classNames({
        [classes.error]:
          transitionState === "error" && displayCompletedActionState,
        [classes.success]:
          transitionState === "success" && displayCompletedActionState,
        [className]: true
      })}
      disabled={!displayCompletedActionState && disabled}
      {...props}
    >
      <CircularProgress
        size={24}
        color="inherit"
        className={classNames({
          [classes.progress]: true,
          [classes.invisible]: transitionState !== "loading"
        })}
      />
      <CheckIcon
        className={classNames({
          [classes.icon]: true,
          [classes.invisible]: !(
            transitionState === "success" && displayCompletedActionState
          )
        })}
      />
      <span
        className={classNames({
          [classes.label]: true,
          [classes.invisible]:
            (transitionState === "loading" || transitionState === "success") &&
            displayCompletedActionState
        })}
      >
        {transitionState === "error" && displayCompletedActionState ? (
          <FormattedMessage defaultMessage="Error" description="button" />
        ) : (
          children || <FormattedMessage {...buttonMessages.confirm} />
        )}
      </span>
    </Button>
  );
};

ConfirmButton.displayName = "ConfirmButton";
export default ConfirmButton;
