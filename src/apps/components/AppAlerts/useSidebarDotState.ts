import { useEffect, useRef, useState } from "react";

import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

type SidebarRemoteDotState = {
  lastClickDate: string;
  lastFailedAttemptDate: string;
};

export const useSidebarDotState = () => {
  const { persist, refetch, webhookAlertState } = useSidebarWebhookAlertMetadata();

  const [isSidebarDotVisible, setIsSidebarDotVisible] = useState(false);
  const lastClickDateRef = useRef<string | null>(null);
  const lastFailedAttemptDateRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const sidebarDotRemoteState = webhookAlertState?.value
        ? (JSON.parse(webhookAlertState?.value) as SidebarRemoteDotState)
        : null;

      if (sidebarDotRemoteState) {
        lastClickDateRef.current = sidebarDotRemoteState.lastClickDate;
        lastFailedAttemptDateRef.current = sidebarDotRemoteState.lastFailedAttemptDate;
      }
    } catch (error) {
      console.error("Failed to parse webhookAlertState value", error);
    }
  }, [webhookAlertState]);

  const handleClick = async (clickDate: string) => {
    const metadataInput = [
      {
        key: "sidebarDotDeliveryAttempt_test",
        value: JSON.stringify({
          lastClickDate: clickDate,
          lastFailedAttemptDate: lastFailedAttemptDateRef.current ?? "",
        } satisfies SidebarRemoteDotState),
      },
    ];

    try {
      await persist(metadataInput);
      // We shouldn't hide the dot immediately after click
      // setIsSidebarDotVisible(false); // Hide dot immediately after click
    } catch (error) {
      console.error("Failed to persist metadata on click", error);
    }
  };

  const handleFailedAttempt = async (failedAttemptDate: string) => {
    const lastClickDate = lastClickDateRef.current ?? "";
    const lastFailedAttemptDate = failedAttemptDate;

    const metadataInput = [
      {
        key: "sidebarDotDeliveryAttempt_test",
        value: JSON.stringify({
          lastClickDate,
          lastFailedAttemptDate,
        } satisfies SidebarRemoteDotState),
      },
    ];

    try {
      await persist(metadataInput);

      if (!lastClickDateRef.current || failedAttemptDate > lastClickDateRef.current) {
        setIsSidebarDotVisible(true);
      }

      lastClickDateRef.current = lastClickDate;
      lastFailedAttemptDateRef.current = lastFailedAttemptDate;
    } catch (error) {
      console.error("Failed to persist metadata on failed attempt", error);
    }
  };

  const handleAuthChange = () => {
    setIsSidebarDotVisible(false);
    refetch();
  };

  return {
    handleAppsListItemClick: handleClick,
    handleAuthChange,
    handleFailedAttempt,
    isSidebarDotVisible,
  };
};
