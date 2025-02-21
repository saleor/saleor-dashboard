import { useUser } from "@dashboard/auth";
import { MetadataInput, useUserAccountUpdateMutation } from "@dashboard/graphql";
import { useMemo } from "react";

const deliveryAttemptKey = "sidebar_app_webhook_alert_state";

type SidebarRemoteDotState = {
  lastClickDate: string;
  lastFailedAttemptDate: string;
};

interface SidebarWebhookAlertMetadata {
  persist: (metadataInput: Record<string, string>) => Promise<void>;
  refetch: () => Promise<void>;
  sidebarDotRemoteState: SidebarRemoteDotState | null;
}

export const useSidebarWebhookAlertMetadata = (): SidebarWebhookAlertMetadata => {
  const { user, refetchUser } = useUser();

  const [saveMetadata] = useUserAccountUpdateMutation();

  const persist = async (metadataInput: Record<string, string>) => {
    await saveMetadata({
      variables: {
        input: {
          metadata: [
            {
              key: deliveryAttemptKey,
              value: JSON.stringify(metadataInput),
            } satisfies MetadataInput,
          ],
        },
      },
    });
  };

  const refetch = async () => {
    if (refetchUser) {
      await refetchUser();
    }
  };

  const sidebarDotRemoteState = useMemo(() => {
    const webhookAlertMetadata = user?.metadata.find(m => m.key === deliveryAttemptKey) ?? null;

    if (!webhookAlertMetadata) {
      return null;
    }

    try {
      const parsed = JSON.parse(webhookAlertMetadata.value);

      return parsed as SidebarRemoteDotState;
    } catch (e) {
      console.error("Failed to parse webhook alert metadata", e);

      return null;
    }
  }, [user]);

  return {
    persist,
    refetch,
    sidebarDotRemoteState,
  };
};
