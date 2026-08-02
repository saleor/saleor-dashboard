import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useChannelSetupReviewStatsQuery } from "@dashboard/graphql";

interface UseChannelSetupReviewStatsArgs {
  channelSlug: string | undefined;
  skip?: boolean;
}

export const useChannelSetupReviewStats = ({
  channelSlug,
  skip = false,
}: UseChannelSetupReviewStatsArgs) => {
  const userPermissions = useUserPermissions();
  const canFetchProducts = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PRODUCTS]);

  const { data, loading } = useChannelSetupReviewStatsQuery({
    skip: skip || !channelSlug || !canFetchProducts,
    variables: {
      channelSlug: channelSlug ?? "",
      canFetchProducts,
    },
  });

  return {
    loading,
    publishedProductCount: canFetchProducts ? (data?.channelProducts?.totalCount ?? 0) : undefined,
    totalProductCount: canFetchProducts ? (data?.allProducts?.totalCount ?? 0) : undefined,
  };
};
