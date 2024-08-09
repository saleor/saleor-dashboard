import { DashboardCard } from "@dashboard/components/Card";
import { Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

export const CardSkeleton: React.FC = () => (
  <DashboardCard>
    <DashboardCard.Content>
      <Skeleton />
    </DashboardCard.Content>
  </DashboardCard>
);
