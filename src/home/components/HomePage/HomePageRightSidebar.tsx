import { DetailPageLayout } from "@dashboard/components/Layouts";
import RequirePermissions from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Activities, HomeData } from "@dashboard/home/types";
import * as React from "react";

import { HomeActivityCard } from "../HomeActivityCard";
import { HomeGetInTouchCard, useGetInTouchCard } from "./HomeGetInTouch";

export interface HomePageRightSidebarProps {
  activities?: HomeData<Activities>;
}

export const HomePageRightSidebar: React.FC<HomePageRightSidebarProps> = ({ activities }) => {
  const { visible: getInTouchVisible, hide: handleCloseClick } = useGetInTouchCard();

  return (
    <DetailPageLayout.RightSidebar>
      {getInTouchVisible && <HomeGetInTouchCard onCloseClick={handleCloseClick} />}

      {activities && (
        <RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_ORDERS]}>
          <HomeActivityCard activities={activities} testId="activity-card" />
        </RequirePermissions>
      )}
    </DetailPageLayout.RightSidebar>
  );
};
