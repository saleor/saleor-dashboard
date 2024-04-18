import { flagInfoToFlagList, Name } from "@dashboard/featureFlags/availableFlags";
import { flagListToMetadata } from "@dashboard/featureFlags/strategies/MetadataStrategy";
import { useFlagsInfo } from "@dashboard/featureFlags/useFlagsInfo";
import { useUserAccountUpdateMutation } from "@dashboard/graphql";

export const usePersistence = () => {
  const flags = useFlagsInfo();
  const [updateAccount] = useUserAccountUpdateMutation();
  const toggleFlag = async (flagName: Name) => {
    const flagList = flagInfoToFlagList(flags);
    flagList[flagName].enabled = !flagList[flagName].enabled;
    const metadata = flagListToMetadata(flagList);

    await updateAccount({
      variables: { input: { metadata } },
    });
  };

  return {
    toggleFlag,
  };
};
