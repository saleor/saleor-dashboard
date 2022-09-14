import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import { Notification } from "@saleor/macaw-ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { TransitionGroup } from "react-transition-group";

import { INotification, ITimer, MessageContext } from ".";
import Container from "./Container";
import { messages as notificationMessages } from "./messages";
import { useStyles } from "./styles";
import Transition from "./Transition";

const MessageManagerProvider = ({ children }) => {
  const timer = useRef(0);
  const classes = useStyles();
  const timersArr = useRef<ITimer[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const intl = useIntl();

  useEffect(() => {
    const timersArrRef = timersArr.current;

    return () => {
      timersArrRef.forEach(timer => clearTimeout(timer.timeoutId));
    };
  }, []);

  const timerCallback = (notification: INotification) => {
    remove(notification.id);
    timersArr.current = timersArr.current.filter(
      timer => timer.id !== notification.id,
    );
  };

  const remove = useCallback(notificationId => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId),
    );
  }, []);

  const clearErrorNotifications = useCallback(() => {
    setNotifications(notifications =>
      notifications.filter(
        notification => notification.message.status !== "error",
      ),
    );
  }, []);

  const show = useCallback(
    (message = {}, timeout = DEFAULT_NOTIFICATION_SHOW_TIME) => {
      const id = timer.current;
      timer.current += 1;
      const notification = {
        close: () => remove(id),
        id,
        message,
        timeout,
      };
      if (timeout !== null) {
        const timeoutId = window.setTimeout(() => {
          timerCallback(notification);
        }, timeout);

        timersArr.current.push({
          id: notification.id,
          notification,
          remaining: timeout,
          start: new Date().getTime(),
          timeoutId,
        });
      }

      setNotifications(state => [notification, ...state]);

      return notification;
    },
    [],
  );

  const getCurrentTimer = (notification: INotification) => {
    const currentTimerIndex = timersArr.current.findIndex(
      timer => timer.id === notification.id,
    );
    return timersArr.current[currentTimerIndex];
  };

  const pauseTimer = (notification: INotification) => {
    const currentTimer = getCurrentTimer(notification);
    if (currentTimer) {
      currentTimer.remaining =
        currentTimer.remaining - (new Date().getTime() - currentTimer.start);
      window.clearTimeout(currentTimer.timeoutId);
    }
  };
  const resumeTimer = (notification: INotification) => {
    const currentTimer = getCurrentTimer(notification);
    if (currentTimer) {
      currentTimer.start = new Date().getTime();
      currentTimer.timeoutId = window.setTimeout(
        () => timerCallback(notification),
        currentTimer.remaining,
      );
    }
  };

  return (
    <>
      <MessageContext.Provider
        value={{ remove, show, clearErrorNotifications }}
      >
        {children}
      </MessageContext.Provider>
      <TransitionGroup
        appear
        options={{ position: "top right" }}
        component={Container}
      >
        {!!notifications.length &&
          notifications.map(notification => (
            <Transition key={notification.id}>
              <Notification
                {...(!!notification.timeout
                  ? {
                      onMouseEnter: () => pauseTimer(notification),
                      onMouseLeave: () => resumeTimer(notification),
                    }
                  : {})}
                onClose={notification.close}
                title={
                  notification.message.apiMessage && !notification.message.title
                    ? intl.formatMessage(commonMessages.defaultErrorTitle)
                    : notification.message.title
                }
                type={notification.message.status || "info"}
                content={notification.message.text}
                apiMessage={
                  notification.message.apiMessage && {
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
                    hideApiLabel: intl.formatMessage(
                      notificationMessages.hideError,
                    ),
                    showApiLabel: intl.formatMessage(
                      notificationMessages.seeError,
                    ),
                  }
                }
                {...(!!notification.message.actionBtn
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
    </>
  );
};

export default MessageManagerProvider;
