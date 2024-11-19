import { DetailPageLayout } from "@dashboard/components/Layouts";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export const HomePage = () => {
  return (
    <DetailPageLayout withSavebar={false}>
      <Box gridColumn="8" gridRowStart="1" />
      <DetailPageLayout.Content>
        <h1>Hello John, welcome to your Store Dashboard</h1>
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar>
        <h1>Right Sidebar</h1>
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
