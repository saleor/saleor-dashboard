import { DEFAULT_NOTIFICATION_SHOW_TIME } from "@dashboard/config";
import { useCallback, useEffect, useRef, useState } from "react";

import { INotification, INotificationContext, ITimer } from ".";

export type MessageComponentValues = ReturnType<typeof useMessageState>["componentState"];

export const useMessageState = () => {
  const timer = useRef(0);
  const timersArr = useRef<ITimer[]>([]);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    const timersArrRef = timersArr.current;

    return () => {
      timersArrRef.forEach(timer => clearTimeout(timer.timeoutId));
    };
  }, []);

  const timerCallback = (notification: INotification) => {
    remove(notification.id);
    timersArr.current = timersArr.current.filter(timer => timer.id !== notification.id);
  };
  const remove = useCallback(notificationId => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== notificationId),
    );
  }, []);
  const clearErrorNotifications = useCallback(() => {
    setNotifications(notifications =>
      notifications.filter(notification => notification.message.status !== "error"),
    );
  }, []);

  const show = useCallback((message = {}, timeout = DEFAULT_NOTIFICATION_SHOW_TIME) => {
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
  }, []);

  const getCurrentTimer = (notification: INotification) => {
    const currentTimerIndex = timersArr.current.findIndex(timer => timer.id === notification.id);

    return timersArr.current[currentTimerIndex];
  };
  const pauseTimer = (notification: INotification) => {
    const currentTimer = getCurrentTimer(notification);

    if (currentTimer) {
      currentTimer.remaining = currentTimer.remaining - (new Date().getTime() - currentTimer.start);
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

  const context = {
    remove,
    show,
    clearErrorNotifications,
  } as INotificationContext;

  const componentState = {
    pauseTimer,
    resumeTimer,
    notifications,
  };

  return {
    context,
    componentState,
  } as const;
};
