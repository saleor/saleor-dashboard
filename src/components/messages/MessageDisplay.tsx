import { commonMessages } from "@dashboard/intl";
import { Portal } from "@radix-ui/react-portal";
import { ApiMessageData, Notification } from "@saleor/macaw-ui";
import { useIntl } from "react-intl";
import { TransitionGroup } from "react-transition-group";

import Container from "./Container";
import { messages as notificationMessages } from "./messages";
import { useStyles } from "./styles";
import Transition from "./Transition";
import { MessageComponentValues } from "./useMessageState";

export const MessageDisplay = ({
  notifications,
  pauseTimer,
  resumeTimer,
}: MessageComponentValues) => {
  const classes = useStyles();
  const intl = useIntl();

  return (
    <Portal>
      <TransitionGroup appear options={{ position: "top right" }} component={Container}>
        {notifications?.map(notification => (
          <Transition key={notification.id}>
            <Notification
              {...(notification.timeout
                ? {
                    onMouseEnter: () => pauseTimer(notification),
                    onMouseLeave: () => resumeTimer(notification),
                  }
                : {})}
              onClose={notification.close}
              title={
                (notification.message.apiMessage && !notification.message.title
                  ? intl.formatMessage(commonMessages.defaultErrorTitle)
                  : notification.message.title) as string
              }
              type={notification.message.status || "info"}
              content={notification.message.text}
              apiMessage={
                (notification.message.apiMessage && {
                  apiMessageContent: (
                    <pre
                      style={{
                        overflowWrap: "anywhere",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {notification.message.apiMessage}
                    </pre>
                  ),
                  hideApiLabel: intl.formatMessage(notificationMessages.hideError),
                  showApiLabel: intl.formatMessage(notificationMessages.seeError),
                }) as ApiMessageData
              }
              {...(notification.message.actionBtn
                ? {
                    action: {
                      label: notification.message.actionBtn.label,
                      onClick: notification.message.actionBtn.action,
                    },
                  }
                : {})}
              className={classes.notification}
            />
          </Transition>
        ))}
      </TransitionGroup>
    </Portal>
  );
};
