import { DetailPageLayout } from "@dashboard/components/Layouts";
import { HomeSidebar } from "@dashboard/newHome/components/HomeSidebar";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export const HomePage = () => {
  return (
    <DetailPageLayout withSavebar={false}>
      <Box gridColumn="8" gridRowStart="1" />
      <DetailPageLayout.Content>
        <h1>Hello John, welcome to your Store Dashboard</h1>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <HomeSidebar />
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
