import { DashboardCard } from "@dashboard/components/Card";
import { Skeleton } from "@saleor/macaw-ui-next";

export const CardSkeleton = () => (
  <DashboardCard>
    <DashboardCard.Content>
      <Skeleton />
    </DashboardCard.Content>
  </DashboardCard>
);
