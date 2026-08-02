import { useUserPermissions } from "@dashboard/auth/hooks/useUserPermissions";
import { type CatalogProductThumbnail } from "@dashboard/channels/components/ChannelCatalogSection/CatalogProductThumbnailStack";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useChannelSetupReviewStatsQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { useMemo } from "react";

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

  const { data, loading, error, refetch } = useChannelSetupReviewStatsQuery({
    skip: skip || !channelSlug || !canFetchProducts,
    variables: {
      channelSlug: channelSlug ?? "",
      canFetchProducts,
    },
  });

  const recentlyPublishedProducts: CatalogProductThumbnail[] | undefined = useMemo(
    () =>
      canFetchProducts
        ? (mapEdgesToItems(data?.recentlyPublishedProducts)?.map(product => ({
            id: product.id,
            name: product.name,
            thumbnailUrl: product.thumbnail?.url ?? null,
          })) ?? [])
        : undefined,
    [canFetchProducts, data?.recentlyPublishedProducts],
  );

  return {
    loading,
    catalogStatsError: Boolean(error),
    canViewCatalogStats: canFetchProducts,
    refetch,
    publishedProductCount:
      canFetchProducts && !error ? (data?.channelProducts?.totalCount ?? undefined) : undefined,
    unpublishedProductCount:
      canFetchProducts && !error
        ? (data?.unpublishedInChannel?.totalCount ?? undefined)
        : undefined,
    listedInChannelCount:
      canFetchProducts && !error ? (data?.listedInChannel?.totalCount ?? undefined) : undefined,
    totalProductCount:
      canFetchProducts && !error ? (data?.allProducts?.totalCount ?? undefined) : undefined,
    recentlyPublishedProducts: canFetchProducts && !error ? recentlyPublishedProducts : undefined,
  };
};
