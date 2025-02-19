import { useUser } from "@dashboard/auth";
import { MetadataInput, useUserAccountUpdateMutation } from "@dashboard/graphql";
import { MetadataItem } from "@saleor/sdk/dist/apollo/types";

const deliveryAttemptKey = "sidebarDotDeliveryAttempt_test";

interface SidebarWebhookAlertMetadata {
  persist: (metadataInput: MetadataInput[]) => Promise<void>;
  refetch: () => Promise<void>;
  webhookAlertState: MetadataItem | null;
}

export const useSidebarWebhookAlertMetadata = (): SidebarWebhookAlertMetadata => {
  const { user, refetchUser } = useUser();

  const [saveMetadata] = useUserAccountUpdateMutation();

  const persist = async (metadataInput: MetadataInput[]) => {
    await saveMetadata({
      variables: { input: { metadata: metadataInput } },
    });
  };

  const refetch = async () => {
    if (refetchUser) {
      await refetchUser();
    }
  };

  const sidebarWebhookAlertMetadata =
    user?.metadata.find(m => m.key === deliveryAttemptKey) ?? null;

  return {
    persist,
    refetch,
    webhookAlertState: sidebarWebhookAlertMetadata,
  };
};
