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
  const canFetchApps = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_APPS]);
  const canFetchProducts = hasPermissions(userPermissions ?? [], [PermissionEnum.MANAGE_PRODUCTS]);

  const { data, loading } = useChannelSetupReviewStatsQuery({
    skip: skip || !channelSlug || (!canFetchApps && !canFetchProducts),
    variables: {
      channelSlug: channelSlug ?? "",
      canFetchApps,
      canFetchProducts,
    },
  });

  // Apps aren't filterable by permission server-side; if the page is truncated we
  // can't know the true HANDLE_PAYMENTS count, so omit the status rather than lie.
  const paymentAppsCount =
    canFetchApps && data?.apps && !data.apps.pageInfo.hasNextPage
      ? data.apps.edges.filter(edge =>
          edge.node.permissions?.some(
            permission => permission.code === PermissionEnum.HANDLE_PAYMENTS,
          ),
        ).length
      : undefined;

  return {
    loading,
    paymentAppsCount,
    publishedProductCount: canFetchProducts ? (data?.channelProducts?.totalCount ?? 0) : undefined,
    totalProductCount: canFetchProducts ? (data?.allProducts?.totalCount ?? 0) : undefined,
  };
};
