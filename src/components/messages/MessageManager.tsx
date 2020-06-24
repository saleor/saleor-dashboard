import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import classNames from "classnames";
import React, { useState } from "react";
import { AlertComponentPropsWithStyle } from "react-alert";
import { FormattedMessage } from "react-intl";

import { IMessage } from "./";
import { useStyles } from "./styles";

export interface IMessageManagerProps extends AlertComponentPropsWithStyle {
  message: IMessage;
}

export const MessageManager: React.FC<IMessageManagerProps> = props => {
  const {
    close,
    options: { timeout },
    message: { actionBtn, expandText, status, title, text, onUndo }
  } = props;

  const [expand, setExpand] = useState(false);

  const classes = useStyles({});

  return (
    <div key={props.id} className={classes.snackbarContainer}>
      <SnackbarContent
        id={props.id}
        key={props.id}
        aria-describedby="message-id"
        className={classNames(classes.snackbar, {
          [classes.error]: status === "error",
          [classes.success]: status === "success",
          [classes.warning]: status === "warning"
        })}
        message={
          <span id="message-id" data-tc="notification">
            {title && (
              <Typography variant="h5" style={{ fontWeight: "bold" }}>
                {title}
              </Typography>
            )}
            <Typography
              className={status === "info" ? classes.textInfo : classes.text}
            >
              {text}
            </Typography>
          </span>
        }
        action={[
          !!expandText ? (
            <div
              key="expanded"
              className={classNames(classes.expandedContainer, {
                [classes.expandedContainerInfo]: status === "info"
              })}
            >
              <div
                className={classNames(
                  classes.expandedContainerContent,
                  expand ? classes.expandedText : classes.hiddenText
                )}
              >
                <p>{expandText}</p>
              </div>
              <button
                className={classNames(classes.expandBtn, {
                  [classes.expandBtnInfo]: status === "info"
                })}
                onClick={() => {
                  setExpand(expand => !expand);
                }}
              >
                {!expand ? (
                  <FormattedMessage
                    defaultMessage="Expand"
                    description="snackbar expand"
                  />
                ) : (
                  <FormattedMessage
                    defaultMessage="Collapse"
                    description="snackbar collapse"
                  />
                )}
              </button>
            </div>
          ) : (
            undefined
          ),
          <div key="actions" className={classes.actionContainer}>
            {!!onUndo && (
              <Button
                key="undo"
                color="default"
                size="small"
                onClick={close}
                data-tc="button-undo"
              >
                <FormattedMessage
                  defaultMessage="Undo"
                  description="snackbar button undo"
                />
              </Button>
            )}
            {!!actionBtn && (
              <Button
                key="action"
                color="default"
                size="small"
                onClick={actionBtn.action}
                data-tc="button-action"
              >
                {actionBtn.label}
              </Button>
            )}
          </div>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={close}
            className={classNames(classes.closeBtn, {
              [classes.closeBtnInfo]: status === "info"
            })}
          >
            <CloseIcon />
          </IconButton>,
          <div className={classes.progressBarContainer} key="progressBar">
            <div
              className={classNames(classes.progressBar, {
                [classes.progressBarActive]: true,
                [classes.progressBarSuccess]: status === "success",
                [classes.progressBarWarning]: status === "warning",
                [classes.progressBarError]: status === "error"
              })}
              style={{ ["--animationTime" as any]: `${timeout}ms` }}
            />
          </div>
        ]}
      />
    </div>
  );
};

export default MessageManager;
