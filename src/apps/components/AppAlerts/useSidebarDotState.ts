import { useEffect, useRef, useState } from "react";

import { useSidebarWebhookAlertMetadata } from "./useSidebarWebhookAlertMetadata";

type SidebarRemoteDotState = {
  lastClickDate: string;
  lastFailedAttemptDate: string;
};

const shouldShowDotCheck = (
  lastClickDate: string | undefined,
  lastFailedAttemptDate: string | undefined,
) => !lastClickDate || (lastFailedAttemptDate && lastFailedAttemptDate > lastClickDate);

export const useSidebarDotState = () => {
  const { persist, refetch, webhookAlertState } = useSidebarWebhookAlertMetadata();

  const [isSidebarDotVisible, setIsSidebarDotVisible] = useState(false);
  const [hasJustClicked, setHasJustClicked] = useState(false);
  const lastClickDateRef = useRef<string | null>(null);
  const lastFailedAttemptDateRef = useRef<string | null>(null);

  // Initialize state from the remote state
  useEffect(() => {
    try {
      const sidebarDotRemoteState = webhookAlertState?.value
        ? (JSON.parse(webhookAlertState?.value) as SidebarRemoteDotState)
        : null;

      if (sidebarDotRemoteState) {
        lastClickDateRef.current = sidebarDotRemoteState.lastClickDate;
        lastFailedAttemptDateRef.current = sidebarDotRemoteState.lastFailedAttemptDate;

        // if (!hasJustClicked) {
        //   setIsSidebarDotVisible(true);
        // }
        const shouldShowDot = !!shouldShowDotCheck(
          lastClickDateRef.current,
          lastFailedAttemptDateRef.current,
        );

        setIsSidebarDotVisible(shouldShowDot);
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
      setHasJustClicked(true);
      // Don't hide dot immediately - wait for next metadata refresh
    } catch (error) {
      console.error("Failed to persist metadata on click", error);
    }
  };

  const handleFailedAttempt = async (failedAttemptDate: string) => {
    const metadataInput = [
      {
        key: "sidebarDotDeliveryAttempt",
        value: JSON.stringify({
          lastClickDate: lastClickDateRef.current ?? "",
          lastFailedAttemptDate: failedAttemptDate,
        } satisfies SidebarRemoteDotState),
      },
    ];

    try {
      await persist(metadataInput);
      lastFailedAttemptDateRef.current = failedAttemptDate;

      // Show dot if no clicks or failed attempt is newer
      if (!lastClickDateRef.current || failedAttemptDate > lastClickDateRef.current) {
        setIsSidebarDotVisible(true);
      }
    } catch (error) {
      console.error("Failed to persist metadata on failed attempt", error);
    }
  };

  // const handleFailedAttempt = async (failedAttemptDate: string) => {
  //   const lastClickDate = lastClickDateRef.current ?? "";
  //   const lastFailedAttemptDate = failedAttemptDate;

  //   const metadataInput = [
  //     {
  //       key: "sidebarDotDeliveryAttempt_test",
  //       value: JSON.stringify({
  //         lastClickDate,
  //         lastFailedAttemptDate,
  //       } satisfies SidebarRemoteDotState),
  //     },
  //   ];

  //   try {
  //     await persist(metadataInput);

  //     if (!lastClickDateRef.current || failedAttemptDate > lastClickDateRef.current) {
  //       setIsSidebarDotVisible(true);
  //     }

  //     lastClickDateRef.current = lastClickDate;
  //     lastFailedAttemptDateRef.current = lastFailedAttemptDate;
  //   } catch (error) {
  //     console.error("Failed to persist metadata on failed attempt", error);
  //   }
  // };

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
