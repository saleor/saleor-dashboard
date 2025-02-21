import { useEffect, useRef, useState } from "react";

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

export const useSidebarDotState = () => {
  const { persist, refetch, sidebarDotRemoteState } = useSidebarWebhookAlertMetadata();

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

  const handleAuthChange = () => {
    setIsSidebarDotVisible(false);
    lastClickDateRef.current = null;
    lastFailedAttemptDateRef.current = null;
    refetch();
  };

  return {
    handleAppsListItemClick: handleClick,
    handleAuthChange,
    handleFailedAttempt,
    isSidebarDotVisible,
  };
};
