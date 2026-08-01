import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

const STORAGE_KEY = "channel-setup-card-dismissed-ids";

/**
 * The setup checklist stays visible (including optional diagnostic steps)
 * until the merchant explicitly dismisses it for that channel.
 */
export const useChannelSetupCardDismiss = (channelId: string) => {
  const [dismissedIds, setDismissedIds] = useLocalStorage<string[]>(STORAGE_KEY, []);
  const isDismissed = dismissedIds.includes(channelId);

  const dismiss = useCallback(() => {
    setDismissedIds(current => (current.includes(channelId) ? current : [...current, channelId]));
  }, [channelId, setDismissedIds]);

  return { isDismissed, dismiss };
};
