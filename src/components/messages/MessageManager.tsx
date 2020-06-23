import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import classNames from "classnames";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { IMessage, MessageContext } from "./";
import { useStyles } from "./styles";

interface Message extends IMessage {
  key: string;
}

export const MessageManager = props => {
  const { children } = props;

  const [message, setMessage] = useState<Message>({
    key: "0",
    onUndo: undefined,
    status: "info",
    text: ""
  });
  const [opened, setOpened] = useState(false);
  const [expand, setExpand] = useState(false);

  const classes = useStyles({});
  const {
    actionBtn,
    autohide = 9000,
    expandText,
    title,
    text,
    key,
    onUndo,
    status = "info"
  } = message;

  const queue = [];

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpened(false);
  };

  const processQueue = () => {
    if (queue.length > 0) {
      setMessage(queue.shift());
      setOpened(true);
    }
  };

  const handleExited = () => {
    processQueue();
  };

  const pushMessage = (message: IMessage) => {
    queue.push({
      key: new Date().getTime(),
      ...message
    });

    if (opened) {
      setOpened(false);
    } else {
      processQueue();
    }
  };

  return (
    <>
      <Snackbar
        key={key}
        anchorOrigin={{
          horizontal: "right",
          vertical: "top"
        }}
        open={opened}
        autoHideDuration={autohide}
        onClose={handleClose}
        onExited={handleExited}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
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
        title={title}
        action={[
          !!expandText ? (
            <div
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
                onClick={handleClose as any}
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
            onClick={handleClose as any}
            className={classNames(classes.closeBtn, {
              [classes.closeBtnInfo]: status === "info"
            })}
          >
            <CloseIcon />
          </IconButton>,
          <div className={classes.progressBarContainer} key="progressBar">
            <div
              className={classNames(classes.progressBar, {
                [classes.progressBarActive]: opened,
                [classes.progressBarSuccess]: status === "success",
                [classes.progressBarWarning]: status === "warning",
                [classes.progressBarError]: status === "error"
              })}
              style={{ ["--animationTime" as any]: `${autohide}ms` }}
            />
          </div>
        ]}
      />
      <MessageContext.Provider value={pushMessage}>
        {children}
      </MessageContext.Provider>
    </>
  );
};

export default MessageManager;
