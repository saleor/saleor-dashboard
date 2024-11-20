import { useUser } from "@dashboard/auth";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum, useHomeActivitiesQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

export const useHomeActivities = () => {
  const { user } = useUser();
  const { channel } = useAppChannel();
  const noChannel = !channel && typeof channel !== "undefined";
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  const {
    data: homeActivities,
    loading: homeActivitiesLoading,
    error: homeActivitiesError,
  } = useHomeActivitiesQuery({
    skip: noChannel,
    variables: {
      hasPermissionToManageOrders,
    },
  });

  return {
    activities: mapEdgesToItems(homeActivities?.activities)?.reverse() ?? [],
    loading: homeActivitiesLoading,
    hasError: !!homeActivitiesError,
  };
};
