import { useUser } from "@dashboard/auth";
import {
  MetadataInput,
  MetadataItemFragment,
  useUserAccountUpdateMutation,
} from "@dashboard/graphql";

const extractGridRelatedMetadata = (metadata: MetadataItemFragment[], key: string) => {
  return metadata.find(meta => meta.key === `grid_${key}`);
};

export const useMetadata = (key: string) => {
  const { user } = useUser();

  const metadata = extractGridRelatedMetadata(user?.metadata ?? [], key);

  const [updateAccount] = useUserAccountUpdateMutation({
    update: (cache, { data }) => {
      const { metadata: incomingMetadata } = data?.accountUpdate?.user || {};

      if (!incomingMetadata || !user) return;

      cache.modify({
        id: cache.identify(user),
        fields: {
          metadata() {
            return incomingMetadata;
          },
        },
      });
    },
  });

  const persist = async (metadataInput: MetadataInput[]) => {
    await updateAccount({
      variables: { input: { metadata: metadataInput } },
    });
  };

  return {
    persist,
    metadata,
  };
};
