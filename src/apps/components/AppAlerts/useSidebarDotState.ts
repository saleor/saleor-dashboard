import { useUser } from "@dashboard/auth";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

const shouldShowDotCheck = (
  lastClickDate: string | undefined,
  lastFailedAttemptDate: string | undefined,
): boolean => {
  if (!lastFailedAttemptDate) {
    return false;
  }

  return !lastClickDate || lastFailedAttemptDate > lastClickDate;
};

interface SidebarDotState {
  handleAppsListItemClick: (clickDate: string) => void;
  handleFailedAttempt: (failedAttemptDate: string) => void;
  isSidebarDotVisible: boolean;
}

export const useSidebarDotState = (): SidebarDotState => {
  const { persist, refetch, sidebarDotRemoteState } = useSidebarWebhookAlertMetadata();
  const { authenticated, authenticating } = useUser();

  const [isSidebarDotVisible, setIsSidebarDotVisible] = useState(false);
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
      );

      setIsSidebarDotVisible(shouldShowDot);
    }
  }, [sidebarDotRemoteState]);

  const handleAuthChange = useCallback(() => {
    setIsSidebarDotVisible(false);
    lastClickDateRef.current = null;
    lastFailedAttemptDateRef.current = null;
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (authenticated && !authenticating) {
      handleAuthChange();
    }
  }, [authenticated, authenticating, handleAuthChange]);

  const handleClick = async (clickDate: string) => {
    try {
      await persist({
        lastClickDate: clickDate,
        lastFailedAttemptDate: lastFailedAttemptDateRef.current ?? "",
      });
      // Don't hide dot immediately - wait for next metadata refresh
    } catch (error) {
      console.error("Failed to persist metadata on click", error);
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
        setIsSidebarDotVisible(true);
      }
    } catch (error) {
      console.error("Failed to persist metadata on failed attempt", error);
    }
  };

  return {
    handleAppsListItemClick: handleClick,
    handleFailedAttempt,
    isSidebarDotVisible,
  };
};
