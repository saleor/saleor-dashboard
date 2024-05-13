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
  const user = useUser();
  const metadata = extractGridRelatedMetadata(user.user?.metadata ?? [], key);
  const [updateAccount] = useUserAccountUpdateMutation();

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
