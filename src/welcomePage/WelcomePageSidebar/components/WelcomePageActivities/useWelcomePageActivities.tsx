import { useWelcomePageActivitiesQuery } from "@dashboard/graphql";
import { mapEdgesToItems } from "@dashboard/utils/maps";

import { useWelcomePageSidebarContext } from "../../context/welcomePageSidebarContext";

export const useWelcomePageActivities = () => {
  const { hasNoChannels, hasPermissionToManageOrders } = useWelcomePageSidebarContext();

  const {
    data: welcomePageActivities,
    loading: welcomePageActivitiesLoading,
    error: welcomePageActivitiesError,
  } = useWelcomePageActivitiesQuery({
    skip: hasNoChannels,
    variables: {
      hasPermissionToManageOrders,
    },
  });

  return {
    activities: mapEdgesToItems(welcomePageActivities?.activities)?.reverse(),
    loading: welcomePageActivitiesLoading,
    hasError: !!welcomePageActivitiesError,
  };
};
