import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { TransitionGroup } from "react-transition-group";

import {
  INotification,
  ITimer,
  MessageContext,
  MessageManagerTemplate
} from ".";
import Container from "./Container";
import Transition from "./Transition";

const containerStyle = {
  display: "grid",
  gridTemplateRows: "repeat(auto-fill, minmax(90px, 1fr)",
  justifyContent: "end",
  zIndex: 1200
};

const MessageManagerProvider = ({ children }) => {
  const root = useRef(null);
  const timersArr = useRef<ITimer[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    root.current = document.createElement("div");
    root.current.id = "__message-manager__";
    document.body.appendChild(root.current);
    const timersArrRef = timersArr.current;

    return () => {
      timersArrRef.forEach(timer => clearTimeout(timer.timeoutId));
      if (root.current) {
        document.body.removeChild(root.current);
      }
    };
  }, []);

  const timerCallback = (notification: INotification) => {
    remove(notification.id);
    timersArr.current = timersArr.current.filter(
      timer => timer.id !== notification.id
    );
  };

  const remove = useCallback(notificationId => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId)
    );
  }, []);

  const show = useCallback((message = {}, timeout = 3000) => {
    const id = Math.random()
      .toString(36)
      .substr(2, 9);

    const notification = {
      close: () => remove(id),
      id,
      message,
      timeout
    };

    const timeoutId = window.setTimeout(() => {
      timerCallback(notification);
    }, timeout);

    timersArr.current.push({
      id: notification.id,
      notification,
      remaining: timeout,
      start: new Date().getTime(),
      timeoutId
    });

    setNotifications(state => [notification, ...state]);

    return notification;
  }, []);

  const getCurrentTimer = (notification: INotification) => {
    const currentTimerIndex = timersArr.current.findIndex(
      timer => timer.id === notification.id
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
        currentTimer.remaining
      );
    }
  };

  return (
    <MessageContext.Provider value={{ remove, show }}>
      {children}
      {root.current &&
        createPortal(
          <TransitionGroup
            appear
            options={{ containerStyle, position: "top right" }}
            component={Container}
          >
            {!!notifications.length &&
              notifications.map(notification => (
                <Transition key={notification.id}>
                  <MessageManagerTemplate
                    onMouseEnter={() => pauseTimer(notification)}
                    onMouseLeave={() => resumeTimer(notification)}
                    {...notification}
                  />
                </Transition>
              ))}
          </TransitionGroup>,
          root.current
        )}
    </MessageContext.Provider>
  );
};

export default MessageManagerProvider;
