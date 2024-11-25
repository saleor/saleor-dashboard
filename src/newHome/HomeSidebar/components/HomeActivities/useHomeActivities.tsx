import { useWelcomePageActivitiesQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useHomeSidebarContext } from "../../context/homeSidebarContext";

export const useHomeActivities = () => {
  const { hasNoChannels, hasPermissionToManageOrders } = useHomeSidebarContext();

  const {
    data: homeActivities,
    loading: homeActivitiesLoading,
    error: homeActivitiesError,
  } = useWelcomePageActivitiesQuery({
    skip: hasNoChannels,
    variables: {
      hasPermissionToManageOrders,
    },
  });

  return {
    activities: mapEdgesToItems(homeActivities?.activities)?.reverse(),
    loading: homeActivitiesLoading,
    hasError: !!homeActivitiesError,
  };
};
