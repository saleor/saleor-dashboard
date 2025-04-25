import { DashboardCard } from "@dashboard/components/Card";
import { BoxProps } from "@saleor/macaw-ui-next";
import * as React from "react";

export type WelcomePageInfoTileProps = {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
  bottomActions: React.ReactNode;
} & Omit<BoxProps, "content">;

export const WelcomePageInfoTile = ({
  id,
  bottomActions,
  content,
  header,
  ...props
}: WelcomePageInfoTileProps) => (
  <DashboardCard
    backgroundColor="default1"
    borderStyle="solid"
    borderColor="default1"
    borderRadius={3}
    borderWidth={1}
    display="flex"
    flexDirection="column"
    gap={4}
    key={id}
    margin={0}
    {...props}
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
