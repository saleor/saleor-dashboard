import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import { WithStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import classNames from "classnames";
import React from "react";

import { IMessage, MessageContext } from "./";
import { styles } from "./styles";

interface Message extends IMessage {
  key: string;
}
interface MessageManagerState {
  message: Message;
  opened: boolean;
}

export const MessageManager = withStyles(styles, { name: "MessageManager" })(
  class MessageManagerComponent extends React.Component<
    WithStyles<typeof styles>,
    MessageManagerState
  > {
    state: MessageManagerState = {
      message: { key: "0", onUndo: undefined, status: "info", text: "" },
      opened: false
    };
    queue = [];

    handleClose = (_, reason) => {
      if (reason === "clickaway") {
        return;
      }
      this.setState({ opened: false });
    };

    handleExited = () => {
      this.processQueue();
    };

    pushMessage = (message: IMessage) => {
      this.queue.push({
        key: new Date().getTime(),
        ...message
      });

      if (this.state.opened) {
        this.setState({ opened: false });
      } else {
        this.processQueue();
      }
    };

    processQueue = () => {
      if (this.queue.length > 0) {
        this.setState({
          message: this.queue.shift(),
          opened: true
        });
      }
    };

    render() {
      const { classes } = this.props;
      const {
        autohide = 3000,
        title,
        text,
        key,
        onUndo,
        status = "info"
      } = this.state.message;
      return (
        <>
          <Snackbar
            key={key}
            anchorOrigin={{
              horizontal: "right",
              vertical: "top"
            }}
            open={this.state.opened}
            autoHideDuration={autohide}
            onClose={this.handleClose}
            onExited={this.handleExited}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            className={classNames({
              [classes.snackbar]: status === "error" || status === "success",
              [classes.error]: status === "error",
              [classes.success]: status === "success"
            })}
            message={
              <span id="message-id" data-tc="notification">
                {title && (
                  <Typography variant="h5" style={{ fontWeight: "bold" }}>
                    {title}
                  </Typography>
                )}
                {text}
              </span>
            }
            title={title}
            action={[
              !!onUndo ? (
                <Button
                  key="undo"
                  color="secondary"
                  size="small"
                  onClick={this.handleClose as any}
                  data-tc="button-undo"
                >
                  UNDO
                </Button>
              ) : (
                undefined
              ),
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose as any}
              >
                <CloseIcon />
              </IconButton>
            ]}
          />
          <MessageContext.Provider value={this.pushMessage}>
            {this.props.children}
          </MessageContext.Provider>
        </>
      );
    }
  }
);
export default MessageManager;
