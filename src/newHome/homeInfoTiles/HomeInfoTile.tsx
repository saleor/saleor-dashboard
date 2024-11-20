import { DashboardCard } from "@dashboard/components/Card";
import * as React from "react";

export type InfoTile = {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
  bottomActions: React.ReactNode;
};

export const HomeInfoTile: React.FC<InfoTile> = ({ id, bottomActions, content, header }) => (
  <DashboardCard
    backgroundColor="default1"
    borderStyle="solid"
    borderColor="default1"
    borderRadius={4}
    borderWidth={1}
    margin={4}
    display="flex"
    flexDirection="column"
    gap={4}
    key={id}
  >
    <DashboardCard.Header>
      <DashboardCard.Title display="flex" alignItems="center" gap={3}>
        {header}
      </DashboardCard.Title>
    </DashboardCard.Header>

    <DashboardCard.Content>{content}</DashboardCard.Content>

    <DashboardCard.BottomActions paddingTop={2} marginTop="auto">
      {bottomActions}
    </DashboardCard.BottomActions>
  </DashboardCard>
);
