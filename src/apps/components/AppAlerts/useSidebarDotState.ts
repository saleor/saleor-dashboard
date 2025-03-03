import { usePersistLoginDate } from "@dashboard/auth/hooks/usePersistLoginDate";
import errorTracker from "@dashboard/services/errorTracking";
import { useEffect, useRef, useState } from "react";

import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

const shouldShowDotCheck = (
  lastClickDate: string | undefined,
  lastFailedAttemptDate: string | undefined,
  lastLoginDate: string | null,
): boolean => {
  if (!lastFailedAttemptDate) {
    return false;
  }

  // check if should show the dot after re-login
  if (lastLoginDate && lastLoginDate > lastFailedAttemptDate) {
    // show dot if last click is older than last login
    return lastClickDate ? lastLoginDate > lastClickDate : true;
  }

  return !lastClickDate || lastFailedAttemptDate > lastClickDate;
};

interface SidebarDotState {
  handleAppsListItemClick: (clickDate: string) => void;
  handleFailedAttempt: (failedAttemptDate: string) => void;
  hasNewFailedAttempts: boolean;
}

export const useSidebarDotState = (): SidebarDotState => {
  const { lastLoginDate } = usePersistLoginDate();
  const { persist, sidebarDotRemoteState } = useSidebarWebhookAlertMetadata();

  const [hasNewFailedAttempts, setHasNewFailedAttempts] = useState(false);
  const lastClickDateRef = useRef<string | null>(null);
  const lastFailedAttemptDateRef = useRef<string | null>(null);

  // Initialize state from the remote state
  useEffect(() => {
    if (sidebarDotRemoteState) {
      lastClickDateRef.current = sidebarDotRemoteState.lastClickDate;
      lastFailedAttemptDateRef.current = sidebarDotRemoteState.lastFailedAttemptDate;

      const shouldShowDot = shouldShowDotCheck(
        lastClickDateRef.current,
        lastFailedAttemptDateRef.current,
        lastLoginDate,
      );

      setHasNewFailedAttempts(shouldShowDot);
    }
  }, [sidebarDotRemoteState, lastLoginDate]);

  const handleClick = async (clickDate: string) => {
    try {
      await persist({
        lastClickDate: clickDate,
        lastFailedAttemptDate: lastFailedAttemptDateRef.current ?? "",
      });
    } catch (error) {
      errorTracker.captureException(error as Error);
    }
  };

  const handleFailedAttempt = async (failedAttemptDate: string) => {
    try {
      await persist({
        lastClickDate: lastClickDateRef.current ?? "",
        lastFailedAttemptDate: failedAttemptDate,
      });
      lastFailedAttemptDateRef.current = failedAttemptDate;

      // Show dot if no clicks or failed attempt is newer
      if (!lastClickDateRef.current || failedAttemptDate > lastClickDateRef.current) {
        setHasNewFailedAttempts(true);
      }
    } catch (error) {
      errorTracker.captureException(error as Error);
    }
  };

  return {
    handleAppsListItemClick: handleClick,
    handleFailedAttempt,
    hasNewFailedAttempts,
  };
};
