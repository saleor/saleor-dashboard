import { useUser } from "@dashboard/auth";
import { MetadataInput, useUserAccountUpdateMutation } from "@dashboard/graphql";
import { useMemo } from "react";

export const DELIVERY_ATTEMPT_KEY = "sidebar_app_webhook_alert_state";

type SidebarRemoteDotState = {
  lastClickDate: string;
  lastFailedAttemptDate: string;
};

interface SidebarWebhookAlertMetadata {
  persist: (metadataInput: Record<string, string>) => Promise<void>;
  sidebarDotRemoteState: SidebarRemoteDotState | null;
}

export const useSidebarWebhookAlertMetadata = (): SidebarWebhookAlertMetadata => {
  const { user } = useUser();

  const [saveMetadata] = useUserAccountUpdateMutation();

  const persist = async (metadataInput: Record<string, string>) => {
    await saveMetadata({
      variables: {
        input: {
          metadata: [
            {
              key: DELIVERY_ATTEMPT_KEY,
              value: JSON.stringify(metadataInput),
            } satisfies MetadataInput,
          ],
        },
      },
    });
  };

  const sidebarDotRemoteState = useMemo(() => {
    const webhookAlertMetadata = user?.metadata.find(m => m.key === DELIVERY_ATTEMPT_KEY) ?? null;

    if (!webhookAlertMetadata) {
      return null;
    }

    try {
      const parsed = JSON.parse(webhookAlertMetadata.value);

      return parsed as SidebarRemoteDotState;
    } catch (e) {
      return null;
    }
  }, [user]);

  return {
    persist,
    sidebarDotRemoteState,
  };
};
