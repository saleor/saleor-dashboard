import { DetailPageLayout } from "@dashboard/components/Layouts";
import { HomeSidebar } from "@dashboard/newHome/components/HomeSidebar";
import { HomeTitle } from "@dashboard/newHome/components/HomeTitle";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

export const HomePage = () => {
  return (
    <DetailPageLayout withSavebar={false}>
      <Box gridColumn="8" gridRowStart="1" />
      <DetailPageLayout.Content marginTop={6} paddingLeft={8}>
        <HomeTitle />
      </DetailPageLayout.Content>
      <DetailPageLayout.RightSidebar borderLeftStyle="none">
        <HomeSidebar />
      </DetailPageLayout.RightSidebar>
    </DetailPageLayout>
  );
};
